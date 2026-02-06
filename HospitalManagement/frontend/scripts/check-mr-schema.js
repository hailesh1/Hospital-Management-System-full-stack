const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: parseInt(process.env.DB_PORT || '5432'),
});

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
    `);
        console.log('Medical Records Columns:');
        res.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
