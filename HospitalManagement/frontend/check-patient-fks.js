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
        console.log('--- CHECKING FOREIGN KEYS POINTING TO PATIENTS ---');
        const res = await pool.query(`
            SELECT
                tc.table_name, 
                kcu.column_name, 
                rc.update_rule, 
                rc.delete_rule,
                tc.constraint_name
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.referential_constraints AS rc
                  ON tc.constraint_name = rc.constraint_name
                  AND tc.table_schema = rc.constraint_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON rc.unique_constraint_name = ccu.constraint_name
                  AND rc.unique_constraint_schema = ccu.constraint_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
              AND ccu.table_name = 'patients';
        `);
        console.table(res.rows);

        const nonCascade = res.rows.filter(r => r.delete_rule !== 'CASCADE');
        if (nonCascade.length > 0) {
            console.log('\n--- FOUND NON-CASCADE FOREIGN KEYS! ---');
            console.table(nonCascade);
        } else {
            console.log('\nAll foreign keys are cascading correctly.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
