const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkStaff() {
    try {
        const res = await pool.query("SELECT role, status, count(*) FROM staff GROUP BY role, status");
        console.log('Staff Status Counts:', res.rows);

        const doctors = await pool.query("SELECT * FROM staff WHERE role = 'DOCTOR' LIMIT 5");
        console.log('Sample Doctors:', doctors.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkStaff();
