const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
});

async function checkInvoicesSchema() {
    try {
        const res = await pool.query(`
            SELECT table_name, column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name IN ('invoices', 'invoice_items')
            ORDER BY table_name, ordinal_position
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkInvoicesSchema();
