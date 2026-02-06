const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function debugInsert() {
  try {
    console.log('Fetching a patient...');
    const patientRes = await pool.query('SELECT id, first_name, last_name FROM patients LIMIT 1');
    if (patientRes.rows.length === 0) {
      console.error('No patients found');
      return;
    }
    const patient = patientRes.rows[0];
    console.log('Patient found:', patient);

    console.log('Fetching a doctor...');
    const doctorRes = await pool.query("SELECT id, first_name, last_name FROM staff WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%' OR role = 'DOCTOR' LIMIT 1");
    if (doctorRes.rows.length === 0) {
      console.error('No doctors found');
      return;
    }
    const doctor = doctorRes.rows[0];
    console.log('Doctor found:', doctor);

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const date = new Date().toISOString().split('T')[0];
    const time = '10:00';
    const reason = 'Debug Test Appointment';
    const status = 'SCHEDULED';
    const type = 'CONSULTATION';
    const patientName = `${patient.first_name} ${patient.last_name}`;
    const doctorName = `${doctor.first_name} ${doctor.last_name}`;

    console.log('Attempting to insert appointment with values:', {
      id,
      patient_id: patient.id,
      doctor_id: doctor.id,
      reason,
      status,
      date,
      time,
      patientName,
      doctorName,
      type
    });

    const result = await pool.query(
      'INSERT INTO appointments (id, patient_id, doctor_id, notes, status, date, time, patient_name, doctor_name, type) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [id, patient.id, doctor.id, reason, status, date, time, patientName, doctorName, type]
    );

    console.log('Insert successful:', result.rows[0]);

  } catch (error) {
    console.error('Insert failed:', error);
  } finally {
    pool.end();
  }
}

debugInsert();
