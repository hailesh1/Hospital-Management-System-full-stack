const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments'
    `);
        console.log(JSON.stringify(res.rows, null, 2));

        const appointments = await pool.query('SELECT * FROM appointments LIMIT 5');
        console.log('Sample appointments:');
        console.log(JSON.stringify(appointments.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();
