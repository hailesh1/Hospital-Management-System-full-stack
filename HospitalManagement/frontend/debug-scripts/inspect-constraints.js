const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:1234@localhost:5432/hospital_management"
});

async function inspectConstraints() {
    try {
        await client.connect();
        const res = await client.query(`
        SELECT conname, pg_get_constraintdef(oid) 
        FROM pg_constraint 
        WHERE conrelid = 'staff'::regclass;
    `);
        console.log('Constraints on staff table:');
        res.rows.forEach(row => console.log(` - ${row.conname}: ${row.pg_get_constraintdef}`));

    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await client.end();
    }
}

inspectConstraints();
