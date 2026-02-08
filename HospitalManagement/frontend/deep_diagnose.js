const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function deepDiagnose() {
    try {
        console.log('--- DEEP DIAGNOSIS: GIGI ---');

        // 1. Search patients by email or name
        const res = await pool.query("SELECT * FROM patients WHERE email ILIKE '%gigi%' OR first_name ILIKE '%gigi%' OR first_name ILIKE '%gig%'");
        console.log(`Found ${res.rows.length} matching patients:`);

        for (const p of res.rows) {
            console.log(`\nPatient ID: "${p.id}"`);
            console.log(`Email: ${p.email}`);
            console.log(`Name: ${p.first_name} ${p.last_name}`);

            // Check record counts for this specific ID
            const counts = {};
            const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];
            for (const t of tables) {
                const c = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id = $1`, [p.id]);
                counts[t] = c.rows[0].count;
            }
            console.log('Counts:', counts);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

deepDiagnose();
