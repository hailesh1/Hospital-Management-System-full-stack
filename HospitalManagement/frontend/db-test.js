const { Pool } = require('pg');
require('dotenv').config({ path: '.env.example' }); // Fallback if no .env

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
    connectionTimeoutMillis: 5000,
});

async function checkDB() {
    console.log('Attempting to connect to DB...');
    try {
        const start = Date.now();
        const res = await pool.query('SELECT NOW()');
        console.log('DB Connected! Time:', res.rows[0].now, 'took', Date.now() - start, 'ms');
    } catch (err) {
        console.error('DB Connection Failed:', err.message);
    } finally {
        await pool.end();
    }
}

checkDB();
