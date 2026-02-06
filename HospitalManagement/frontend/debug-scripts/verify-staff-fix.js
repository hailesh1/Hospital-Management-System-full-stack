const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function verify() {
    try {
        console.log('--- VERIFYING STAFF FIX ---');

        // 1. Check Constraint
        const constraintRes = await pool.query(`
            SELECT pg_get_constraintdef(c.oid) 
            FROM pg_constraint c 
            JOIN pg_namespace n ON n.oid = c.connamespace 
            WHERE n.nspname = 'public' 
            AND conrelid = 'staff'::regclass 
            AND conname = 'staff_status_check';
        `);
        console.log('Constraint Definition:', constraintRes.rows[0]?.pg_get_constraintdef || 'NOT FOUND');

        // 2. Find a staff member to test with
        const staffRes = await pool.query("SELECT id FROM staff LIMIT 1");
        if (staffRes.rowCount === 0) {
            console.log('No staff members found to test.');
            return;
        }
        const staffId = staffRes.rows[0].id;
        console.log('Testing with Staff ID:', staffId);

        // 3. Test Update via SQL (simulating API logic)
        const testStatuses = ['BUSY', 'AWAY', 'ACTIVE'];
        for (const status of testStatuses) {
            try {
                await pool.query("UPDATE staff SET status = $1 WHERE id = $2", [status, staffId]);
                console.log(`Successfully updated to status: ${status}`);
            } catch (err) {
                console.error(`Failed to update to status: ${status}. Error: ${err.message}`);
            }
        }

        console.log('--- VERIFICATION COMPLETE ---');
    } catch (err) {
        console.error('Verification Error:', err.message);
    } finally {
        await pool.end();
    }
}

verify();
