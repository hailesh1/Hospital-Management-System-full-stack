const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkAllIds() {
    try {
        const tables = ['patients', 'appointments', 'staff', 'lab_tests', 'prescriptions', 'medical_records', 'invoices', 'departments', 'vital_signs'];
        const res = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE column_name = 'id' AND table_name = ANY($1)
        `, [tables]);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkAllIds();
