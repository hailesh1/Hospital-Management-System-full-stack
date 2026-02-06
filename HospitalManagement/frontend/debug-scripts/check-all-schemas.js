const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function check() {
    const tables = ['patients', 'staff', 'appointments', 'medical_records', 'lab_tests', 'prescriptions', 'invoices'];
    for (const table of tables) {
        console.log(`\n--- TABLE: ${table} ---`);
        const res = await pool.query(`
            SELECT column_name, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = $1 
            ORDER BY ordinal_position
        `, [table]);
        console.table(res.rows);
    }
    await pool.end();
}

check();
