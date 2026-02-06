import { query } from '@/lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        const result = await query('SELECT * FROM appointments WHERE id = $1', [id]);
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { status, reason, diagnosis, prescription, notes, appointment_date } = req.body;

        // Build dynamic query based on provided fields
        const fields = [];
        const values = [];
        let idx = 1;

        if (status) { fields.push(`status = $${idx++}`); values.push(status); }
        if (reason) { fields.push(`reason = $${idx++}`); values.push(reason); }
        if (diagnosis) { fields.push(`diagnosis = $${idx++}`); values.push(diagnosis); }
        if (prescription) { fields.push(`prescription = $${idx++}`); values.push(prescription); }
        if (notes) { fields.push(`notes = $${idx++}`); values.push(notes); }

        if (appointment_date) {
          fields.push(`appointment_date = $${idx++}`); values.push(appointment_date);

          // Derive date and time
          const d = new Date(appointment_date);
          const dateStr = d.toISOString().split('T')[0];
          const timeStr = d.toTimeString().split(' ')[0].substring(0, 5);

          fields.push(`date = $${idx++}`); values.push(dateStr);
          fields.push(`time = $${idx++}`); values.push(timeStr);
        }

        if (fields.length === 0) {
          return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const text = `UPDATE appointments SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;

        const result = await query(text, values);

        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
