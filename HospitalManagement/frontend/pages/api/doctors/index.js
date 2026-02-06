import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await query(
          "SELECT id, first_name, last_name, first_name || ' ' || last_name as name, specialization as specialization_name, specialization, phone, email FROM staff WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR' ORDER BY id ASC"
        );

        const doctors = result.rows.map(doc => ({
          id: doc.id,
          firstName: doc.first_name,
          lastName: doc.last_name,
          name: doc.name,
          specializationName: doc.specialization_name,
          specialization: doc.specialization,
          phone: doc.phone,
          email: doc.email
        }));

        res.status(200).json(doctors);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, specialization, phone, email, qualification, experience } = req.body;

        // Split name into first and last name for staff table
        const nameParts = name ? name.split(' ') : ['Unknown', 'Doctor'];
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const id = crypto.randomUUID();

        const result = await query(
          'INSERT INTO staff (id, first_name, last_name, email, phone, role, specialization, status, join_date) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE) RETURNING *',
          [id, firstName, lastName, email, phone, 'DOCTOR', specialization, 'ACTIVE']
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
