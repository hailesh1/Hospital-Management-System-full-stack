const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function run() {
    try {
        console.log('--- CHECKING COLUMNS ---');
        const tables = ['lab_tests', 'prescriptions', 'invoices', 'patients'];
        
        for (const table of tables) {
             const res = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            console.log(`\nTable: ${table}`);
            console.log(res.rows.map(r => r.column_name).join(', '));
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
