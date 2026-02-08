const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function debugGigi() {
    try {
        console.log('--- DEBUGGING GIGI@GMAIL.COM ---');

        // 1. Find the patient(s) with this email
        const patients = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE email ILIKE 'gigi@gmail.com'");
        console.log('Patients found:');
        console.table(patients.rows);

        if (patients.rows.length === 0) {
            console.log('No patient found with that email.');
            return;
        }

        const ids = patients.rows.map(p => p.id);
        console.log('Checking records for IDs:', ids);

        for (const id of ids) {
            console.log(`\n--- Records for ID: ${id} ---`);

            const mr = await pool.query('SELECT count(*) FROM medical_records WHERE patient_id = $1', [id]);
            console.log('Medical Records:', mr.rows[0].count);

            const pr = await pool.query('SELECT count(*) FROM prescriptions WHERE patient_id = $1', [id]);
            console.log('Prescriptions:', pr.rows[0].count);

            const lt = await pool.query('SELECT count(*) FROM lab_tests WHERE patient_id = $1', [id]);
            console.log('Lab Tests:', lt.rows[0].count);

            const inv = await pool.query('SELECT count(*) FROM invoices WHERE patient_id = $1', [id]);
            console.log('Invoices:', inv.rows[0].count);
        }

        // 2. Search for any records that might match by name but have different IDs
        console.log('\n--- Searching for orphan records by name ---');
        const orphanMR = await pool.query("SELECT id, patient_id, patient_name, title FROM medical_records WHERE patient_name ILIKE '%gigi%' OR patient_name ILIKE '%g %'");
        console.log('Potential orphan Medical Records:');
        console.table(orphanMR.rows);

    } catch (err) {
        console.error('Debug failed:', err);
    } finally {
        await pool.end();
    }
}

debugGigi();
