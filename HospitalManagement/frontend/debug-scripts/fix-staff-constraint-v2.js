const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:1234@localhost:5432/hospital_management'
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        await client.query('ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_status_check');
        console.log('Dropped old constraint');

        const addConstraintQuery = `
            ALTER TABLE staff ADD CONSTRAINT staff_status_check 
            CHECK (status IN ('ACTIVE', 'INACTIVE', 'AVAILABLE', 'BUSY', 'AWAY', 'OFFLINE', 'Available', 'Busy', 'In Personal Break', 'Offline', 'AWAY', 'BUSY', 'ACTIVE'))
        `;
        // I'll add them all just to be safe, including duplicates if any
        await client.query(addConstraintQuery);
        console.log('Added new constraint with BUSY, AWAY, etc.');

        // Sanity check
        const res = await client.query(`
            SELECT pg_get_constraintdef(c.oid) 
            FROM pg_constraint c 
            JOIN pg_namespace n ON n.oid = c.connamespace 
            WHERE n.nspname = 'public' 
            AND conrelid = 'staff'::regclass 
            AND conname = 'staff_status_check';
        `);
        console.log('New Constraint Definition:', res.rows[0]?.pg_get_constraintdef);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

run();
