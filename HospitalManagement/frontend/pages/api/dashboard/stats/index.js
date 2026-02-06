import { query } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        // Consolidate all counts into a single query to reduce DB connections
        const sql = `
            SELECT
                (SELECT COUNT(*) FROM patients) as patients,
                (SELECT COUNT(*) FROM staff WHERE LOWER(role) = 'doctor') as doctors,
                (SELECT COUNT(*) FROM staff) as staff,
                (SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Addis_Ababa') = CURRENT_DATE) as appointments_today,
                (SELECT COUNT(*) FROM medical_records) as medical_records,
                (SELECT COUNT(*) FROM departments) as departments,
                (SELECT COALESCE(SUM(total), 0) FROM invoices WHERE LOWER(status) = 'paid' AND DATE(created_at) = CURRENT_DATE) as revenue,
                (SELECT COUNT(*) FROM invoices) as billing,
                (SELECT COUNT(*) FROM patients WHERE LOWER(status) = 'active') as active_patients,
                (SELECT COUNT(*) FROM staff WHERE LOWER(status) = 'active') as active_staff,
                (SELECT COUNT(*) FROM patients WHERE LOWER(gender) = 'outpatient' OR LOWER(blood_type) = 'outpatient') as outpatients,
                (SELECT COUNT(*) FROM patients WHERE DATE(registered_date) = CURRENT_DATE) as new_today,
                (SELECT COUNT(*) FROM staff WHERE (LOWER(role) = 'doctor') AND (LOWER(status) = 'active' OR status IS NULL OR status = '')) as active_doctors,
                (SELECT COUNT(*) FROM medical_records WHERE LOWER(type) LIKE '%lab%') as lab_tests,
                (SELECT COUNT(*) FROM staff WHERE LOWER(role) = 'nurse') as nurses,
                (SELECT COUNT(*) FROM staff WHERE LOWER(role) = 'admin') as admin,
                (SELECT COUNT(*) FROM staff WHERE LOWER(role) NOT IN ('doctor', 'nurse', 'admin')) as support
        `;

        const result = await query(sql);
        const data = result.rows[0];

        res.status(200).json({
            patients: parseInt(data.patients),
            doctors: parseInt(data.doctors),
            staff: parseInt(data.staff),
            appointmentsToday: parseInt(data.appointments_today),
            medicalRecords: parseInt(data.medical_records),
            departments: parseInt(data.departments),
            revenue: parseFloat(data.revenue),
            billing: parseInt(data.billing),
            activePatients: parseInt(data.active_patients),
            activeStaff: parseInt(data.active_staff),
            outpatients: parseInt(data.outpatients),
            newToday: parseInt(data.new_today),
            activeDoctors: parseInt(data.active_doctors),
            labTests: parseInt(data.lab_tests),
            nurses: parseInt(data.nurses),
            admin: parseInt(data.admin),
            support: parseInt(data.support)
        });
    } catch (error) {
        console.error('Database error in stats API:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
