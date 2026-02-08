const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function exhaustiveAudit() {
    try {
        console.log('--- EXHAUSTIVE GIGI DATA AUDIT ---');

        // 1. Get all patient IDs associated with the email
        const patients = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE email = 'gigi@gmail.com'");
        const ids = patients.rows.map(r => r.id);
        console.log('Patient IDs for gigi@gmail.com:', ids);

        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];

        for (const table of tables) {
            console.log(`\nTable: ${table}`);
            // Check for records matching the known IDs
            for (const id of ids) {
                const res = await pool.query(`SELECT * FROM ${table} WHERE patient_id = $1`, [id]);
                if (res.rows.length > 0) {
                    console.log(` - Found ${res.rows.length} records for ID: "${id}"`);
                    console.table(res.rows.map(r => ({ id: r.id, patient_id: r.patient_id, created_at: r.created_at })));
                }
            }

            // Also check for ANY records where patient_id might be a string variation of 'gigi'
            const variations = await pool.query(`SELECT * FROM ${table} WHERE (patient_id ILIKE '%gigi%' OR patient_id ILIKE '%gig%') AND patient_id NOT IN (${ids.map((_, i) => `$${i + 1}`).join(',')})`, ids);
            if (variations.rows.length > 0) {
                console.log(` - Found ${variations.rows.length} records with OTHER gig/gigi variations:`);
                console.table(variations.rows.map(r => ({ id: r.id, patient_id: r.patient_id })));
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

exhaustiveAudit();
