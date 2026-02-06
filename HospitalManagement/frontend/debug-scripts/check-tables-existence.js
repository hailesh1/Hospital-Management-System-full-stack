const { query } = require('./lib/db');

async function checkTables() {
    const tables = ['departments', 'invoices', 'appointments', 'medical_records', 'patients', 'staff'];
    for (const table of tables) {
        console.log(`Checking table: ${table}...`);
        try {
            const res = await query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`Table ${table} exists, count: ${res.rows[0].count}`);
        } catch (err) {
            console.error(`Table ${table} error:`, err.message);
        }
    }
    process.exit();
}

checkTables();
