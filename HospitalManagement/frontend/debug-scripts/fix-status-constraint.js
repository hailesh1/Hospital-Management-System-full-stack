const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:1234@localhost:5432/hospital_management"
});

async function fixConstraint() {
    try {
        await client.connect();
        console.log('Connected to database');

        await client.query('ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_status_check');
        console.log('Dropped old constraint');

        const addConstraintQuery = `
      ALTER TABLE staff ADD CONSTRAINT staff_status_check 
      CHECK (status IN ('ACTIVE', 'INACTIVE', 'Available', 'Busy', 'In Personal Break', 'Offline'))
    `;
        await client.query(addConstraintQuery);
        console.log('Added new constraint allowing availability statuses');

    } catch (err) {
        console.error('Fix failed:', err);
    } finally {
        await client.end();
    }
}

fixConstraint();
