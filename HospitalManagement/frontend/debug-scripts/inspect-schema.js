const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:1234@localhost:5432/hospital_management"
});

async function inspect() {
    try {
        await client.connect();
        const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'staff'
    `);
        console.log('Columns in staff table:');
        res.rows.forEach(row => console.log(` - ${row.column_name}: ${row.data_type}`));

    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await client.end();
    }
}

inspect();
