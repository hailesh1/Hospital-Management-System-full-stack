import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const { patientId } = req.query;
                if (!patientId) {
                    return res.status(400).json({ error: 'Patient ID is required' });
                }
                const result = await query(
                    'SELECT * FROM vital_signs WHERE patient_id = $1 ORDER BY recorded_at DESC',
                    [patientId]
                );
                res.status(200).json(result.rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;

        case 'POST':
            try {
                const {
                    patientId, appointmentId, weight, height,
                    bloodPressure, temperature, pulse, respiratoryRate
                } = req.body;

                const result = await query(
                    `INSERT INTO vital_signs 
          (patient_id, appointment_id, weight, height, blood_pressure, temperature, pulse, respiratory_rate) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
          RETURNING *`,
                    [patientId, appointmentId, weight, height, bloodPressure, temperature, pulse, respiratoryRate]
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
