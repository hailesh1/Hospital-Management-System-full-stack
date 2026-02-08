const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function findDups() {
    try {
        const email = 'gigi@gmail.com';
        const res = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE LOWER(TRIM(email)) = $1", [email.toLowerCase().trim()]);
        console.log(`Patients with email ${email}:`);
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

findDups();
