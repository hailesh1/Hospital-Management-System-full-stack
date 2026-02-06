const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testInsert() {
  try {
    console.log("Connecting to DB...");
    // 1. Get a patient
    const resPat = await pool.query('SELECT id, first_name, last_name FROM patients LIMIT 1');
    if (resPat.rows.length === 0) throw new Error("No patients found");
    const patient = resPat.rows[0];
    console.log("Patient:", patient);

    // 2. Get a doctor
    const resDoc = await pool.query("SELECT id, first_name, last_name FROM staff WHERE role ILIKE '%doctor%' OR role = 'DOCTOR' LIMIT 1");
    if (resDoc.rows.length === 0) throw new Error("No doctors found");
    const doctor = resDoc.rows[0];
    console.log("Doctor:", doctor);

    // 3. Prepare data
    const id = 'TEST-' + Math.random().toString(36).substring(7);
    const date = new Date().toISOString().split('T')[0];
    const time = '10:00';
    const status = 'SCHEDULED';
    const type = 'CONSULTATION';
    const reason = 'Test appointment';

    console.log("Inserting appointment with:", { id, date, time, status, type });

    // 4. Insert
    const res = await pool.query(
      'INSERT INTO appointments (id, patient_id, doctor_id, reason, status, date, time, patient_name, doctor_name, type) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        id, 
        patient.id, 
        doctor.id, 
        reason, 
        status, 
        date, 
        time, 
        `${patient.first_name} ${patient.last_name}`, 
        `${doctor.first_name} ${doctor.last_name}`, 
        type
      ]
    );

    console.log("Success! Inserted:", res.rows[0]);

    // 5. Cleanup
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    console.log("Cleaned up.");

  } catch (err) {
    console.error("Test Failed:", err);
  } finally {
    await pool.end();
  }
}

testInsert();