const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkReferences() {
    try {
        const query = `
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE column_name IN ('patient_id', 'invoice_id', 'patient_email', 'patient_name')
        `;
        const res = await pool.query(query);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkReferences();
