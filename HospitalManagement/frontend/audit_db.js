const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function audit() {
    try {
        const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.columns 
      WHERE column_name = 'patient_id' 
      AND table_schema = 'public'
    `);
        console.log('Tables needing patient_id migration:');
        console.table(res.rows.map(r => r.table_name));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

audit();
