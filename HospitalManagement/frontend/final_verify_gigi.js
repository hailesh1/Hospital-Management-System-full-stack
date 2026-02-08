const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function verify() {
    try {
        const uuid = 'fba9f8eb-1c6f-4033-afc6-34cf1e386dc1';
        console.log('--- VERIFYING GIGI UUID:', uuid, '---');

        const tables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices', 'insurance_claims', 'vital_signs'];
        for (const t of tables) {
            const res = await pool.query(`SELECT count(*) FROM ${t} WHERE patient_id = $1`, [uuid]);
            console.log(`${t}: ${res.rows[0].count}`);
        }

        console.log('\n--- CHECKING FOR NEW GIGI RECORDS ---');
        const newGigi = await pool.query("SELECT id, email, first_name, last_name, created_at FROM patients WHERE email ILIKE '%gigi%' ORDER BY created_at DESC");
        console.table(newGigi.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

verify();
