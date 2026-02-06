const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 5000,
});

async function test() {
    try {
        console.log('Testing raw pool query...');
        const res = await pool.query('SELECT NOW()');
        console.log('Success:', res.rows[0]);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

test();
