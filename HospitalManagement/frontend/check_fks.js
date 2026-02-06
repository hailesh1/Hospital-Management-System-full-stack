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
        console.log('--- CHECKING FK CONSTRAINTS ---');
        const tables = ['lab_tests', 'prescriptions', 'invoices'];
        
        for (const table of tables) {
             const res = await pool.query(`
                SELECT kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name 
                FROM information_schema.key_column_usage kcu
                JOIN information_schema.constraint_column_usage ccu ON kcu.constraint_name = ccu.constraint_name
                JOIN information_schema.table_constraints tc ON kcu.constraint_name = tc.constraint_name
                WHERE kcu.table_name = $1 AND tc.constraint_type = 'FOREIGN KEY'
            `, [table]);
            console.log(`\nTable: ${table}`);
            if (res.rows.length === 0) {
                console.log('No Foreign Keys');
            } else {
                res.rows.forEach(r => {
                    console.log(`${r.column_name} -> ${r.foreign_table_name}.${r.foreign_column_name}`);
                });
            }
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
