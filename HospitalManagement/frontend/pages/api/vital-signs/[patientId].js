import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { patientId } = req.query;
    const { method } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        // Fetch the most recent vital signs for the patient
        const result = await query(
            `SELECT 
        id,
        weight,
        height,
        blood_pressure,
        temperature,
        pulse,
        respiratory_rate,
        recorded_at
      FROM vital_signs
      WHERE patient_id = $1
      ORDER BY recorded_at DESC
      LIMIT 10`,
            [patientId]
        );

        const vitalSigns = result.rows.map(vs => ({
            id: vs.id,
            weight: vs.weight,
            height: vs.height,
            bloodPressure: vs.blood_pressure,
            temperature: vs.temperature,
            pulse: vs.pulse,
            respiratoryRate: vs.respiratory_rate,
            recordedAt: new Date(vs.recorded_at).toISOString(),
            date: new Date(vs.recorded_at).toISOString().split('T')[0],
        }));

        res.status(200).json(vitalSigns);

    } catch (error) {
        console.error('Error fetching vital signs:', error);
        res.status(500).json({ error: 'Failed to fetch vital signs', details: error.message });
    }
}
