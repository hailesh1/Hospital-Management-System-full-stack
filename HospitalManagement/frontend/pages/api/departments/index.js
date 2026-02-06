import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                // Return departments with staff counts
                const result = await query(`
                    SELECT 
                        d.id, 
                        d.name, 
                        d.description,
                        COUNT(s.id)::int as staff_count
                    FROM departments d
                    LEFT JOIN staff s ON d.id = s.department_id
                    GROUP BY d.id, d.name, d.description
                    ORDER BY d.name ASC
                `);
                res.status(200).json(result.rows);
            } catch (error) {
                console.error('API Error in /api/departments:', error);
                res.status(500).json({ error: error.message });
            }
            break;

        case 'POST':
            try {
                const { name, description } = req.body;
                const id = Math.random().toString(36).substring(2, 15);
                const result = await query(
                    'INSERT INTO departments (id, name, description) VALUES ($1, $2, $3) RETURNING *',
                    [id, name, description]
                );
                res.status(201).json(result.rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'Department ID is required' });
                }
                const result = await query('DELETE FROM departments WHERE id = $1', [id]);
                if (result.rowCount === 0) {
                    return res.status(404).json({ error: 'Department not found' });
                }
                res.status(200).json({ message: 'Department deleted successfully' });
            } catch (error) {
                console.error('DELETE /api/departments error:', error);
                if (error.code === '23503') {
                    return res.status(400).json({ error: 'Cannot delete department: It is still referenced by other records (e.g. staff or appointments).' });
                }
                res.status(500).json({ error: error.message || 'Internal server error' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
