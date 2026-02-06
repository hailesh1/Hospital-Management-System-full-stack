const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
    connectionTimeoutMillis: 5000,
});

async function test() {
    try {
        console.log('Attempting direct DB connection...');
        const client = await pool.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        client.release();
        await pool.end();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

test();
