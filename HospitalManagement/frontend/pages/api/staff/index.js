import { query } from '@/lib/db';
import crypto from 'crypto';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const result = await query(`
          SELECT s.*, d.name as department_name 
          FROM staff s 
          LEFT JOIN departments d ON s.department_id = d.id 
          ORDER BY s.created_at DESC
        `);
                res.status(200).json(result.rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'POST':
            try {
                const { firstName, lastName, email, phone, role, specialization, departmentId, joinDate } = req.body;
                console.log('--- CREATING STAFF ---', { firstName, lastName, email, role, departmentId });

                // Handle empty string for UUID field - Postgres will reject "" for UUID
                const deptIdValue = departmentId && departmentId.trim() !== "" ? departmentId : null;
                const joinDateValue = joinDate && joinDate.trim() !== "" ? joinDate : new Date().toISOString().split('T')[0];
                const id = crypto.randomUUID();

                const result = await query(
                    'INSERT INTO staff (id, first_name, last_name, email, phone, role, specialization, department_id, join_date, status, availability_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                    [id, firstName, lastName, email, phone, role?.toUpperCase(), specialization, deptIdValue, joinDateValue, 'ACTIVE', 'AVAILABLE']
                );
                console.log('Staff created successfully:', result.rows[0].id);
                res.status(201).json(result.rows[0]);
            } catch (error) {
                console.error('Error in POST /api/staff:', {
                    message: error.message,
                    code: error.code,
                    detail: error.detail,
                    body: req.body
                });
                if (error.code === '23505') {
                    return res.status(409).json({ error: 'Email already exists' });
                }
                if (error.code === '23503') {
                    return res.status(400).json({ error: 'Invalid department ID' });
                }
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
