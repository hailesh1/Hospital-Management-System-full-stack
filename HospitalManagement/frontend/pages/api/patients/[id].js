import { query } from '@/lib/db';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await query('SELECT * FROM patients WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { name, dob, gender, address, phone, email } = req.body;
        const result = await query(
          'UPDATE patients SET name = $1, dob = $2, gender = $3, address = $4, phone = $5, email = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
          [name, dob, gender, address, phone, email, id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const result = await query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json({ message: 'Patient deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
