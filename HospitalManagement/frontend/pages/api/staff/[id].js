import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;
    const { id, subroute } = req.query; // status will be in subroute if using catch-all or similar

    if (!id) {
        return res.status(400).json({ error: 'Staff ID is required' });
    }

    // Helper to check if ID is a valid UUID
    const isUUID = (str) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };

    if (!isUUID(id)) {
        return res.status(400).json({ error: 'Invalid Staff ID format. Expected UUID.' });
    }

    // Handle /api/staff/[id]/status
    if (req.url.endsWith('/status') && method === 'PUT') {
        try {
            const { status } = req.body;
            if (!status) return res.status(400).json({ error: 'Status is required' });

            const result = await query(
                'UPDATE staff SET status = $1 WHERE id = $2 RETURNING id, first_name, last_name, status, role',
                [status.toUpperCase(), id]
            );

            if (result.rowCount === 0) return res.status(404).json({ error: 'Staff member not found' });
            return res.status(200).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    switch (method) {
        case 'GET':
            try {
                const result = await query('SELECT * FROM staff WHERE id = $1', [id]);
                if (result.rowCount === 0) return res.status(404).json({ error: 'Staff member not found' });
                res.status(200).json(result.rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'PUT':
            try {
                const body = req.body;
                const fieldsToUpdate = {};
                if (body.firstName || body.first_name) fieldsToUpdate.first_name = body.firstName || body.first_name;
                if (body.lastName || body.last_name) fieldsToUpdate.last_name = body.lastName || body.last_name;
                if (body.email) fieldsToUpdate.email = body.email;
                if (body.phone) fieldsToUpdate.phone = body.phone;
                if (body.role) fieldsToUpdate.role = body.role.toUpperCase();
                if (body.specialization) fieldsToUpdate.specialization = body.specialization;
                if (body.status) fieldsToUpdate.status = body.status.toUpperCase();

                if (Object.prototype.hasOwnProperty.call(body, 'departmentId') || Object.prototype.hasOwnProperty.call(body, 'department_id')) {
                    const dId = body.departmentId || body.department_id;
                    fieldsToUpdate.department_id = (dId && dId.trim() !== "") ? dId : null;
                }

                if (Object.keys(fieldsToUpdate).length === 0) {
                    return res.status(400).json({ error: 'No fields to update' });
                }

                const keys = Object.keys(fieldsToUpdate);
                const values = Object.values(fieldsToUpdate);
                const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
                const finalQuery = `UPDATE staff SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`;
                const result = await query(finalQuery, [...values, id]);

                if (result.rowCount === 0) return res.status(404).json({ error: 'Staff member not found' });
                res.status(200).json(result.rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'DELETE':
            try {
                // Handle references
                await query('DELETE FROM appointments WHERE doctor_id = $1', [id]);
                await query('UPDATE medical_records SET doctor_id = NULL WHERE doctor_id = $1', [id]);
                await query('UPDATE lab_tests SET ordered_by = NULL WHERE ordered_by = $1', [id]);
                await query('UPDATE prescriptions SET prescribed_by = NULL WHERE prescribed_by = $1', [id]);
                await query('UPDATE patients SET created_by = NULL WHERE created_by = $1', [id]);
                // Invoices do not have a direct staff reference column to update

                const result = await query('DELETE FROM staff WHERE id = $1', [id]);
                if (result.rowCount === 0) return res.status(404).json({ error: 'Staff member not found' });
                res.status(204).end();
            } catch (error) {
                console.error('Error in DELETE /api/staff/[id]:', error);
                res.status(500).json({ error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
