const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:1234@127.0.0.1:5432/hospital_management'
});

async function main() {
    try {
        console.log('--- PATIENTS TABLE ---');
        const patients = await pool.query('SELECT id, email, first_name, last_name FROM patients');
        console.table(patients.rows);

        const clinicalTables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];

        for (const table of clinicalTables) {
            console.log(`\n--- ${table.toUpperCase()} DISTRIBUTION ---`);
            const counts = await pool.query(`
        SELECT patient_id, count(*) as count 
        FROM ${table} 
        GROUP BY patient_id
      `);
            console.table(counts.rows);

            if (counts.rows.length > 0) {
                console.log(`Sample records from ${table}:`);
                const samples = await pool.query(`SELECT id, patient_id, patient_name FROM ${table} LIMIT 3`);
                console.table(samples.rows);
            }
        }

    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await pool.end();
    }
}

main();
