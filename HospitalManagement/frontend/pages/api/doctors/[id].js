import { query } from '@/lib/db';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await query(
          "SELECT id, first_name || ' ' || last_name as name, specialization as specialization_name, specialization, phone, email, status FROM staff WHERE id = $1 AND (role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR')",
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { name, specialization, phone, email, status } = req.body;

        // Split name into first and last name
        const nameParts = name ? name.split(' ') : ['Unknown', 'Doctor'];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const result = await query(
          'UPDATE staff SET first_name = $1, last_name = $2, specialization = $3, phone = $4, ' +
          'email = $5, status = $6 ' +
          'WHERE id = $7 AND (role ILIKE \'%doctor%\' OR role ILIKE \'%specialist%\' OR role = \'DOCTOR\') RETURNING *',
          [firstName, lastName, specialization, phone, email, status || 'ACTIVE', id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const result = await query('DELETE FROM staff WHERE id = $1 AND (role ILIKE \'%doctor%\' OR role ILIKE \'%specialist%\' OR role = \'DOCTOR\') RETURNING *', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
