const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 5000,
});

async function run() {
    console.log('Testing connection with: postgres@localhost:5432/hospital_management');
    try {
        const client = await pool.connect();
        console.log('SUCCESSFUL CONNECTION');
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Result:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('CONNECTION ERROR:', err.message);
        console.error('CODE:', err.code);
    } finally {
        await pool.end();
    }
}

run();
