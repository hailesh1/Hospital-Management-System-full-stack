const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
});

async function checkColumn() {
    try {
        const res = await pool.query(`
            SELECT column_name, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'patients' AND column_name = 'registered_date'
        `);
        console.log('Column info:', res.rows[0]);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkColumn();
