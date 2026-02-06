const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
});

async function applyFix() {
    try {
        console.log('Applying permanent schema fix for registered_date...');
        await pool.query(`
            ALTER TABLE patients 
            ALTER COLUMN registered_date SET DEFAULT CURRENT_DATE
        `);
        console.log('Success: registered_date now has a default value (CURRENT_DATE).');
    } catch (err) {
        console.error('Error applying fix:', err.message);
    } finally {
        await pool.end();
    }
}

applyFix();
