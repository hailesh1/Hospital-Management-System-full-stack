const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function listDevPatients() {
    try {
        const res = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE id LIKE 'dev-%'");
        console.log('Dev Patients in database:');
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

listDevPatients();
