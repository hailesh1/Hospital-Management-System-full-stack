import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        let { doctor_id } = req.query;

        // Handle mock/development doctor IDs or missing IDs
        if (doctor_id) {
            const doctorExists = await query('SELECT id FROM staff WHERE id = $1', [doctor_id]);
            if (doctorExists.rows.length === 0) {
                console.log(`[API] Dashboard Appts: Doctor ID ${doctor_id} not found. Using fallback.`);
                const fallbackDoctor = await query("SELECT id FROM staff WHERE role ILIKE '%doctor%' OR position ILIKE '%doctor%' ORDER BY id ASC LIMIT 1");
                if (fallbackDoctor.rows.length > 0) {
                    doctor_id = fallbackDoctor.rows[0].id;
                }
            }
        }

        let whereClause = "a.date = DATE(CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Addis_Ababa')";
        const queryParams = [];

        if (doctor_id) {
            whereClause += " AND a.doctor_id = $1";
            queryParams.push(doctor_id);
        }

        const result = await query(`
            SELECT 
                a.id,
                a.time as time,
                to_char(a.date, 'YYYY-MM-DD') as date_iso,
                COALESCE(NULLIF(CONCAT(p.first_name, ' ', p.last_name), ' '), a.patient_name) as "patientName",
                COALESCE(NULLIF(CONCAT(d.first_name, ' ', d.last_name), ' '), a.doctor_name) as "doctorName",
                a.status,
                COALESCE(NULLIF(a.type, ''), 'General Checkup') as type,
                p.id as "patientId"
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
            LEFT JOIN staff d ON a.doctor_id = d.id
            WHERE ${whereClause}
            ORDER BY a.date ASC, a.time ASC
        `, queryParams);


        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching dashboard appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
}
