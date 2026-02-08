const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres:1234@127.0.0.1:5432/hospital_management'
});

async function main() {
    try {
        const r = await pool.query("SELECT id, email, first_name, last_name FROM patients WHERE email ILIKE 'gigi@gmail.com'");
        console.log('Patients with email gigi@gmail.com:');
        console.table(r.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

main();
Riverside:
