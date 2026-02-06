const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fixData() {
    try {
        console.log('Updating existing data to fix case-sensitivity issue...');
        const res = await pool.query("UPDATE patients SET gender = 'MALE' WHERE gender = 'male'");
        console.log('Fixed rows:', res.rowCount);

        const res2 = await pool.query("UPDATE patients SET gender = 'FEMALE' WHERE gender = 'female'");
        console.log('Fixed female rows:', res2.rowCount);

        const res3 = await pool.query("UPDATE patients SET status = 'ACTIVE' WHERE status = 'Active'");
        console.log('Fixed status rows:', res3.rowCount);

        const res4 = await pool.query("UPDATE staff SET role = UPPER(role), status = 'ACTIVE'");
        console.log('Ensured all staff roles are UPPERCASE.');

        console.log('Success: Existing database records are now uppercase.');
    } catch (err) {
        console.error('Error fixing data:', err.message);
    } finally {
        await pool.end();
    }
}

fixData();
