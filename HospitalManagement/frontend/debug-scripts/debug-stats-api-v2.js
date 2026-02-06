console.log('Script started');
try {
    const db = require('./lib/db');
    console.log('lib/db required successfully');
    const { query } = db;

    async function debugStatsQueries() {
        const queries = [
            { name: 'patientsCount', sql: 'SELECT COUNT(*) FROM patients' },
            { name: 'doctorsCount', sql: "SELECT COUNT(*) FROM staff WHERE role = 'DOCTOR'" },
            { name: 'staffCount', sql: 'SELECT COUNT(*) FROM staff' },
            { name: 'appointmentsToday', sql: 'SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE' },
            { name: 'medicalRecordsCount', sql: 'SELECT COUNT(*) FROM medical_records' },
            { name: 'departmentsCount', sql: 'SELECT COUNT(*) FROM departments' },
            { name: 'revenueResult', sql: "SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE status = 'paid' AND DATE(created_at) = CURRENT_DATE" },
            { name: 'billingCount', sql: 'SELECT COUNT(*) FROM invoices' },
            { name: 'activePatients', sql: "SELECT COUNT(*) FROM patients WHERE LOWER(status) = 'active'" },
            { name: 'activeStaff', sql: "SELECT COUNT(*) FROM staff WHERE LOWER(status) = 'active'" },
            { name: 'outpatientsCount', sql: "SELECT COUNT(*) FROM patients WHERE gender = 'Outpatient' OR blood_type = 'Outpatient'" },
            { name: 'newPatientsToday', sql: "SELECT COUNT(*) FROM patients WHERE registered_date = CURRENT_DATE" },
            { name: 'activeDoctors', sql: "SELECT COUNT(*) FROM staff WHERE (role = 'DOCTOR' OR role = 'doctor') AND (LOWER(status) = 'active' OR status IS NULL OR status = '')" },
            { name: 'labTestsCount', sql: "SELECT COUNT(*) FROM medical_records WHERE type = 'lab' OR type = 'Lab Results'" }
        ];

        for (const q of queries) {
            console.log(`Running query: ${q.name}...`);
            try {
                const start = Date.now();
                const result = await query(q.sql);
                const duration = Date.now() - start;
                console.log(`Success: ${q.name} returned ${result.rows[0].count ?? result.rows[0].total} (took ${duration}ms)`);
            } catch (error) {
                console.error(`Error in ${q.name}:`, error.message);
            }
        }
        process.exit();
    }

    debugStatsQueries();
} catch (err) {
    console.error('Failed to start script:', err);
    process.exit(1);
}
