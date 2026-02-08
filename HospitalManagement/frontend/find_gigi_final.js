const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function findGigi() {
    try {
        const email = 'gigi@gmail.com';
        const res = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE email ILIKE $1", [email]);
        console.log('--- GIGI PATIENT RECORDS ---');
        console.table(res.rows);

        const clinicalTables = ['appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];
        for (const t of clinicalTables) {
            const records = await pool.query(`SELECT patient_id, count(*) FROM ${t} WHERE patient_id LIKE 'dev-%' GROUP BY patient_id`);
            console.log(`\n--- ${t.toUpperCase()} COUNTS ---`);
            console.table(records.rows);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

findGigi();
Riverside:
