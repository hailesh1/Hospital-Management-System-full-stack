const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkStaffConstraints() {
  try {
    console.log("Checking constraints for table 'staff'...");
    const res = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) AS def 
      FROM pg_constraint 
      WHERE conrelid = 'staff'::regclass
    `);
    
    res.rows.forEach(r => {
      console.log(`Constraint: ${r.conname}`);
      console.log(`Definition: ${r.def}`);
      console.log('---');
    });

    // Also check current status values to see what's in there
    const statusRes = await pool.query(`SELECT DISTINCT status FROM staff`);
    console.log("Current distinct status values in staff table:", statusRes.rows.map(r => r.status));

  } catch (err) {
    console.error('Error checking constraints:', err);
  } finally {
    pool.end();
  }
}

checkStaffConstraints();
