import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        let { patientId: queryPatientId, patient_id } = req.query;
        let patientId = (queryPatientId || patient_id || '').trim();

        console.log(`[API] GET /api/patient/stats: patientId=${patientId}`);

        // Handle mock/development patient IDs or missing IDs
        if (patientId) {
            const patientExists = await query('SELECT id FROM patients WHERE LOWER(TRIM(id)) = LOWER(TRIM($1))', [patientId]);
            if (patientExists.rows.length === 0) {
                console.log(`[API] Stats: Patient ID "${patientId}" NOT FOUND even with TRIM/LOWER.`);
                return res.status(200).json({
                    upcomingAppointments: 0,
                    medicalRecords: 0,
                    prescriptions: 0,
                    messages: 0,
                    nextAppointment: null
                });
            }
            console.log(`[API] Stats: Patient ID "${patientId}" confirmed.`);
        }

        if (!patientId) {
            // Return empty stats if no patient ID is provided or found
            return res.status(200).json({
                upcomingAppointments: 0,
                medicalRecords: 0,
                prescriptions: 0,
                messages: 0,
                nextAppointment: null
            });
        }

        const safeQuery = async (sql, params, defaultVal = 0) => {
            try {
                const res = await query(sql, params);
                if (res.rows.length > 0) {
                    if (res.rows[0].count !== undefined) return parseInt(res.rows[0].count);
                    return res.rows[0];
                }
                return defaultVal;
            } catch (err) {
                console.error(`Query failed: ${sql} `, err.message);
                return defaultVal;
            }
        };

        const appointmentsCount = await safeQuery('SELECT COUNT(*) as count FROM appointments WHERE patient_id = $1 AND appointment_date >= NOW()', [patientId]);
        const recordsCount = await safeQuery('SELECT COUNT(*) as count FROM medical_records WHERE patient_id = $1', [patientId]);
        const prescriptionsCount = await safeQuery('SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = $1 AND LOWER(status) = \'active\'', [patientId]);
        const messagesCount = await safeQuery("SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false", [patientId]);
        const nextAppt = await safeQuery('SELECT appointment_date FROM appointments WHERE patient_id = $1 AND appointment_date >= NOW() ORDER BY appointment_date ASC LIMIT 1', [patientId], null);

        res.status(200).json({
            upcomingAppointments: appointmentsCount,
            medicalRecords: recordsCount,
            prescriptions: prescriptionsCount,
            messages: messagesCount,
            nextAppointment: nextAppt ? nextAppt.appointment_date : null
        });
    } catch (error) {
        console.error('Error fetching patient stats:', error);
        res.status(500).json({ error: 'Failed to fetch patient stats' });
    }
}
