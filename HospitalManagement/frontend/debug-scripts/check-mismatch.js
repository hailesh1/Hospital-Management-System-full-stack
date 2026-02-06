const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkSchema() {
    try {
        console.log('--- Table details: appointments ---');
        const resApp = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'appointments'
        `);
        console.table(resApp.rows);

        console.log('\n--- Table details: vital_signs ---');
        const resVital = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'vital_signs'
        `);
        console.table(resVital.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
