const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
});

async function enableUuidExtension() {
    try {
        console.log('Enabling uuid-ossp extension...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        console.log('Success: uuid-ossp extension enabled.');
    } catch (err) {
        console.error('Error enabling extension:', err.message);
    } finally {
        await pool.end();
    }
}

enableUuidExtension();
