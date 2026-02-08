const { query } = require('./frontend/lib/db');

async function checkConstraints() {
    try {
        const res = await query(`
      SELECT conname, pg_get_constraintdef(oid)
      FROM pg_constraint
      WHERE conrelid = 'patients'::regclass;
    `);
        console.log('Constraints on patients table:');
        console.table(res.rows);
    } catch (error) {
        console.error('Error checking constraints:', error.message);
    }
}

checkConstraints();
