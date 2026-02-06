require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

async function checkSchema() {
    try {
        const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'medical_records'");
        console.log('Columns:', res.rows);
    } catch (err) {
        console.error('Schema Error:', err.message);
    } finally {
        pool.end();
    }
}

checkSchema();
