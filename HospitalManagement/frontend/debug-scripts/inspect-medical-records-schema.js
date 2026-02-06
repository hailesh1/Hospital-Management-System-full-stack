const { query } = require('./lib/db');

async function inspectSchema() {
    try {
        const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'medical_records'
        `);
        console.log('Medical Records Schema:');
        console.table(res.rows);

        const data = await query('SELECT * FROM medical_records LIMIT 1');
        console.log('Sample Row:', data.rows[0]);
    } catch (err) {
        console.error('Error:', err.message);
    }
    process.exit();
}

inspectSchema();
