const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkConstraint() {
    try {
        const res = await pool.query(`
            SELECT pg_get_constraintdef(oid) AS constraint_def
            FROM pg_constraint
            WHERE conname = 'lab_tests_test_type_check';
        `);

        if (res.rows.length > 0) {
            console.log('Constraint Definition:', res.rows[0].constraint_def);
        } else {
            console.log('Constraint not found by name.');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkConstraint();
