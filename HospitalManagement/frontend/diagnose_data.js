const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function diagnose() {
    try {
        console.log('--- DIAGNOSING STAFF TABLE ---');
        const staffCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'staff'");
        console.log('Staff columns:');
        console.table(staffCols.rows.map(r => r.column_name));

        console.log('\n--- DIAGNOSING DATA VISIBILITY ---');
        // Check for patient 'gigi@gmail.com'
        const gigi = await pool.query("SELECT id, email, first_name || ' ' || last_name as name FROM patients WHERE email ILIKE 'gigi@gmail.com'");
        console.log('Patient gigi@gmail.com:');
        console.table(gigi.rows);

        const tables = ['lab_tests', 'prescriptions', 'invoices', 'medical_records', 'appointments'];
        for (const t of tables) {
            console.log(`\nChecking ${t}...`);
            const all = await pool.query(`SELECT count(*) as total, count(p.id) as linked, count(*) - count(p.id) as orphaned FROM ${t} left join patients p on ${t}.patient_id = p.id`);
            console.table(all.rows);

            const samples = await pool.query(`SELECT patient_id, patient_name FROM ${t} LIMIT 5`);
            console.log(`Sample records from ${t}:`);
            console.table(samples.rows);
        }

    } catch (err) {
        console.error('Diagnosis failed:', err);
    } finally {
        await pool.end();
    }
}

diagnose();
