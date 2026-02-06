const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function testUpdateStatus() {
  try {
    // 1. Find a staff member
    const res = await pool.query("SELECT id, first_name, availability_status FROM staff LIMIT 1");
    if (res.rowCount === 0) {
        console.log("No staff found to test.");
        return;
    }
    const staff = res.rows[0];
    console.log(`Testing with staff: ${staff.first_name} (ID: ${staff.id}), Current Status: ${staff.availability_status}`);

    // 2. Try to update to BUSY
    const newStatus = 'BUSY';
    console.log(`Updating to ${newStatus}...`);
    const updateRes = await pool.query(
        'UPDATE staff SET availability_status = $1 WHERE id = $2 RETURNING id, first_name, availability_status',
        [newStatus, staff.id]
    );
    console.log("Update result:", updateRes.rows[0]);

    // 3. Revert to original
    console.log(`Reverting to ${staff.availability_status}...`);
    await pool.query('UPDATE staff SET availability_status = $1 WHERE id = $2', [staff.availability_status, staff.id]);
    console.log("Reverted.");

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    pool.end();
  }
}

testUpdateStatus();
