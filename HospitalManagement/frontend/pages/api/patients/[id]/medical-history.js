import { query } from '@/lib/db';

export default async function handler(req, res) {
    const { id } = req.query;
    const { method } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        // Fetch patient basic info including allergies and medical history
        const patientResult = await query(
            'SELECT allergies, medical_history FROM patients WHERE id = $1',
            [id]
        );

        if (patientResult.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const patient = patientResult.rows[0];

        // Fetch medical records (visits)
        let visitsResult;
        
        // We know 'symptoms' column doesn't exist, but 'type' and 'notes' now do (after schema fix).
        // So we select '' as symptoms, but real columns for others.
        try {
            visitsResult = await query(
                `SELECT 
            mr.id,
            mr.date,
            '' as symptoms,
            mr.diagnosis,
            mr.treatment,
            mr.notes,
            COALESCE(mr.doctor_name, s.first_name || ' ' || s.last_name, 'Unknown Doctor') as doctor,
            COALESCE(mr.type, 'General Checkup') as type
          FROM medical_records mr
          LEFT JOIN staff s ON mr.doctor_id::text = s.id::text
          WHERE mr.patient_id = $1
          ORDER BY mr.date DESC
          LIMIT 10`,
                [id]
            );
        } catch (err) {
            console.error("Error fetching visits:", err);
            // Emergency fallback if something else is wrong
             visitsResult = { rows: [] };
        }

        // Fetch prescriptions
        const prescriptionsResult = await query(
            `SELECT 
        p.id,
        p.medication_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.prescribed_date as date,
        COALESCE(s.first_name || ' ' || s.last_name, 'Unknown Doctor') as prescribed_by
      FROM prescriptions p
      LEFT JOIN staff s ON p.doctor_id::text = s.id::text
      WHERE p.patient_id = $1
      ORDER BY p.prescribed_date DESC
      LIMIT 10`,
            [id]
        );

        // Fetch vaccinations (stored as medical records with specific type)
        let vaccinationsResult;
        // Since we added 'type' and 'title' columns, we can use the main query safely.
        try {
            vaccinationsResult = await query(
                `SELECT 
            title as name,
            date
          FROM medical_records
          WHERE patient_id = $1 
          AND (LOWER(type) = 'vaccination' OR LOWER(type) LIKE '%vaccine%')
          ORDER BY date DESC
          LIMIT 10`,
                [id]
            );
        } catch (err) {
            // Fallback for older records where type might be null but diagnosis has keywords
             vaccinationsResult = await query(
                 `SELECT 
             COALESCE(diagnosis, treatment, 'Vaccination') as name,
             date
           FROM medical_records
           WHERE patient_id = $1 
           AND (
             (diagnosis IS NOT NULL AND LOWER(diagnosis) LIKE '%vaccin%') OR 
             (treatment IS NOT NULL AND LOWER(treatment) LIKE '%vaccin%')
           )
           ORDER BY date DESC
           LIMIT 10`,
                 [id]
             );
        }

        // Parse allergies and chronic conditions
        const allergies = patient.allergies
            ? patient.allergies.split(',').map(a => a.trim()).filter(a => a)
            : ['No known allergies'];

        const chronicConditions = patient.medical_history
            ? patient.medical_history.split(',').map(c => c.trim()).filter(c => c)
            : ['None reported'];

        // Format visits
        const visits = visitsResult.rows.map(visit => ({
            id: visit.id,
            date: visit.date ? new Date(visit.date).toISOString().split('T')[0] : 'N/A',
            type: visit.type,
            doctor: visit.doctor ? (visit.doctor.startsWith('Dr.') ? visit.doctor : `Dr. ${visit.doctor}`) : 'Unknown Doctor',
            diagnosis: visit.diagnosis || visit.symptoms || 'General consultation',
            notes: visit.notes || visit.treatment || 'No additional notes',
        }));

        // Format prescriptions
        const prescriptions = prescriptionsResult.rows.map(rx => ({
            id: rx.id,
            date: rx.date ? new Date(rx.date).toISOString().split('T')[0] : 'N/A',
            medication: rx.medication_name,
            dosage: `${rx.dosage || ''} - ${rx.frequency || ''}`.trim(),
            prescribedBy: rx.prescribed_by ? (rx.prescribed_by.startsWith('Dr.') ? rx.prescribed_by : `Dr. ${rx.prescribed_by}`) : 'Unknown Doctor',
        }));

        // Format vaccinations
        const vaccinations = vaccinationsResult.rows.map(vax => ({
            name: vax.name,
            date: vax.date ? new Date(vax.date).toISOString().split('T')[0] : 'N/A',
        }));

        // Return aggregated medical history
        res.status(200).json({
            visits,
            prescriptions,
            allergies,
            chronicConditions,
            vaccinations: vaccinations.length > 0 ? vaccinations : [
                { name: 'No vaccination records', date: 'N/A' }
            ],
        });

    } catch (error) {
        console.error('Error fetching medical history:', error);
        res.status(500).json({ error: 'Failed to fetch medical history', details: error.message });
    }
}
