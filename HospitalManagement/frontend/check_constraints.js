const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'hospital_management',
  password: '1234',
  port: 5432,
});

async function checkConstraints() {
  try {
    console.log("Checking constraints for 'appointments' table...");
    
    const resConstraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as definition
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE c.conrelid = 'appointments'::regclass;
    `);
    
    resConstraints.rows.forEach(row => {
        console.log(`Constraint: ${row.conname}`);
        console.log(`Definition: ${row.definition}`);
        console.log('---');
    });

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

checkConstraints();