const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function verifyInsert() {
  try {
    console.log('Verifying medical record insertion...');
    
    // Get a patient ID
    const patRes = await pool.query('SELECT id FROM patients LIMIT 1');
    if (patRes.rows.length === 0) {
        console.log('No patients found.');
        return;
    }
    const patientId = patRes.rows[0].id;

    // Simulate the API insert query
    // The API uses: INSERT INTO medical_records (..., date, ...) VALUES (..., NOW(), ...)
    
    const text = `
        INSERT INTO medical_records (id, patient_id, title, type, file_name, notes, date)
        VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW())
        RETURNING *
    `;
    const values = [patientId, 'Test Record', 'consultation', '', 'Test Description'];
    
    const res = await pool.query(text, values);
    console.log('Inserted record:', res.rows[0]);
    console.log('Success! Date was populated:', res.rows[0].date);

  } catch (err) {
    console.error('Insert failed:', err);
  } finally {
    pool.end();
  }
}

verifyInsert();
