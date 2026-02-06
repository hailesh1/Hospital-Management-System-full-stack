import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const statsSql = `
            SELECT
                (SELECT COUNT(*) FROM patients) as total_patients,
                (SELECT COUNT(*) FROM staff) as total_staff,
                (SELECT COUNT(*) FROM appointments) as total_appointments,
                (SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE) as appointments_today,
                (SELECT COALESCE(SUM(total), 0) FROM invoices WHERE LOWER(status) = 'paid') as total_revenue,
                (SELECT COUNT(*) FROM medical_records) as total_medical_records
        `;
        const statsResult = await query(statsSql);
        const stats = statsResult.rows[0];

        const recentAppointments = await query(`
            SELECT a.id, p.first_name || ' ' || p.last_name as patient_name, a.appointment_date, a.status 
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
            ORDER BY a.appointment_date DESC
            LIMIT 10
        `);

        const reportData = {
            report_title: "Hospital System Audit Report",
            generated_at: new Date().toISOString(),
            overview: {
                patients: parseInt(stats.total_patients),
                staff: parseInt(stats.total_staff),
                total_appointments: parseInt(stats.total_appointments),
                appointments_today: parseInt(stats.appointments_today),
                total_revenue: parseFloat(stats.total_revenue),
                medical_records: parseInt(stats.total_medical_records)
            },
            recent_activities: recentAppointments.rows,
            system_status: "Healthy",
            audit_logs: [
                { timestamp: new Date().toISOString(), action: "REPORT_GENERATION", user: "Admin", details: "Full system audit report requested" }
            ]
        };

        res.status(200).json(reportData);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
