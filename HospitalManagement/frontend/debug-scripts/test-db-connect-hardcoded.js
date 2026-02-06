const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
    connectionTimeoutMillis: 2000,
});

async function test() {
    console.log('Attempting to connect...');
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connected:', res.rows[0]);

        const count = await pool.query('SELECT COUNT(*) FROM patients');
        console.log('Patients count:', count.rows[0].count);

    } catch (err) {
        console.error('Connection error:', err);
    } finally {
        await pool.end();
        console.log('Done.');
    }
}

test();
