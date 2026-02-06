const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
});

async function checkGenderConstraint() {
    try {
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(oid) as definition
            FROM pg_constraint
            WHERE conname = 'patients_gender_check'
        `);
        console.log('Gender constraint:');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkGenderConstraint();
