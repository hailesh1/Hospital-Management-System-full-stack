require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

async function checkPatients() {
    try {
        console.log('Checking patients count...');
        const result = await pool.query('SELECT COUNT(*) FROM patients');
        console.log('Total patients in DB:', result.rows[0].count);

        if (result.rows[0].count > 0) {
            const sample = await pool.query('SELECT id, first_name, status FROM patients LIMIT 5');
            console.log('Sample data:', sample.rows);
        }
    } catch (error) {
        console.error('Database query failed:', error);
    } finally {
        await pool.end();
    }
}

checkPatients();
