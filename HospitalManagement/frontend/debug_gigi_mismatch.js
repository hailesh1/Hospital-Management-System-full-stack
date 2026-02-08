const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function debugMismatch() {
    try {
        console.log('--- PATIENT DATA CHECK ---');
        const patients = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE id IN ('dev-gigi', '1fbd8f83-389c-45aa-b4f5-88be4785cbdf', 'fba9f8eb-1c6f-4033-afc6-34cf1e386dc1') OR first_name ILIKE '%Jara%' OR first_name ILIKE '%gig%'");
        console.table(patients.rows);

        console.log('\n--- APPOINTMENTS CHECK ---');
        const apps = await pool.query("SELECT id, patient_id, patient_name, doctor_name FROM appointments WHERE patient_id IN ('dev-gigi', '1fbd8f83-389c-45aa-b4f5-88be4785cbdf', 'fba9f8eb-1c6f-4033-afc6-34cf1e386dc1') OR patient_name ILIKE '%gig%' OR patient_name ILIKE '%Jara%'");
        console.table(apps.rows);

        console.log('\n--- LOGGED IN USER CHECK (dev mode simulation) ---');
        // The user screenshot shows "gigi g" (gigi@gmail.com) in the top right.
        // Let's see if there's any record with gigi@gmail.com and what ID it has.
        const gigi = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE LOWER(email) = 'gigi@gmail.com'");
        console.log('Patient with email gigi@gmail.com:');
        console.table(gigi.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

debugMismatch();
