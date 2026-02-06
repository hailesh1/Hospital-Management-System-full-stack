const { Pool } = require('pg');
const fs = require('fs');

async function checkSchema() {
    const pool = new Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'hospital_management',
        password: '1234',
        port: 5432
    });

    try {
        const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'staff'");
        fs.writeFileSync('staff_schema.json', JSON.stringify(res.rows, null, 2));
        console.log('Success');
    } catch (e) {
        fs.writeFileSync('staff_schema_error.txt', e.message);
        console.error(e);
    } finally {
        await pool.end();
    }
}

checkSchema();
