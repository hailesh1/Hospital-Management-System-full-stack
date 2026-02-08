const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function inspectIds() {
    try {
        console.log('--- INSPECTING PATIENT IDs (HEX) ---');
        const res = await pool.query('SELECT id, first_name, last_name FROM patients');

        for (const row of res.rows) {
            const hexId = Buffer.from(row.id).toString('hex');
            console.log(`Name: ${row.first_name} ${row.last_name}`);
            console.log(`ID: "${row.id}" (hex: ${hexId})`);
            console.log('---');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

inspectIds();
