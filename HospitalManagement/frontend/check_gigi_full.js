const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkGigi() {
    try {
        console.log('--- GIGI DIAGNOSIS ---');

        // 1. Check all patients matching 'gigi'
        const patients = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE email ILIKE '%gigi%' OR first_name ILIKE '%gigi%'");
        console.log('Patients found:');
        console.table(patients.rows);

        if (patients.rows.length === 0) {
            console.log('No patients found for "gigi"');
            return;
        }

        // 2. For each Gigi, check their records
        for (const p of patients.rows) {
            console.log(`\nChecking records for ID: ${p.id} (${p.email})`);

            const tables = ['prescriptions', 'lab_tests', 'invoices', 'medical_records', 'appointments'];
            for (const t of tables) {
                const count = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id = $1`, [p.id]);
                console.log(` - ${t}: ${count.rows[0].count}`);
            }
        }

        // 3. Check for any 'orphaned' records that might be hers (matching by name)
        console.log('\n--- ORPHANED / MISNAMED RECORDS ---');
        const orphaned = await pool.query("SELECT 'medical_records' as tbl, id, patient_id, patient_name FROM medical_records WHERE patient_name ILIKE '%gigi%'");
        console.table(orphaned.rows);

        const orphanedPresc = await pool.query("SELECT 'prescriptions' as tbl, id, patient_id, patient_name FROM prescriptions WHERE patient_name ILIKE '%gigi%'");
        console.table(orphanedPresc.rows);

        // 4. Check column types for ID
        console.log('\n--- COLUMN TYPES ---');
        const types = await pool.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE column_name = 'patient_id' AND table_name IN ('patients', 'medical_records', 'prescriptions')");
        console.table(types.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkGigi();
