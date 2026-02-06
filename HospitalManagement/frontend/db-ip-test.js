const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
    connectionTimeoutMillis: 1000,
});

async function run() {
    console.log('Connecting to 127.0.0.1...');
    try {
        await client.connect();
        console.log('CONNECTED');
        const res = await client.query('SELECT 1');
        console.log('Query result:', res.rows);
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await client.end();
    }
}

run();
