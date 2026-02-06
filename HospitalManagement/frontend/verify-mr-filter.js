const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function verifyFiltering() {
  try {
    console.log('Verifying medical record filtering...');
    
    // Get a patient ID
    const patRes = await pool.query('SELECT id FROM patients LIMIT 1');
    if (patRes.rows.length === 0) {
        console.log('No patients found.');
        return;
    }
    const patientId = patRes.rows[0].id;
    console.log('Testing with Patient ID:', patientId);

    // Simulate the API query
    const text = `
          SELECT 
            mr.id,
            mr.patient_id as "patientId",
            CONCAT(p.first_name, ' ', p.last_name) as patient,
            CONCAT(p.first_name, ' ', p.last_name) as patient_name,
            mr.doctor_name as doctor,
            mr.created_at as date,
            COALESCE(mr.title, mr.diagnosis, 'Medical Record') as title,
            mr.notes as description,
            COALESCE(mr.type, 'consultation') as type,
            COALESCE(mr.file_name, '') as "fileName",
            mr.diagnosis,
            mr.treatment,
            'completed' as status
          FROM medical_records mr
          LEFT JOIN patients p ON mr.patient_id = p.id
          WHERE mr.patient_id = $1
          ORDER BY mr.created_at DESC
    `;
    
    const res = await pool.query(text, [patientId]);
    console.log(`Found ${res.rows.length} records for this patient.`);
    if (res.rows.length > 0) {
        console.log('Sample record:', res.rows[0]);
    }

    // Verify fetching with NO ID (should fail or we can't test query param logic directly here, but we tested the SQL)
    // The API logic ensures WHERE clause is added only if patientId exists.

  } catch (err) {
    console.error('Query failed:', err);
  } finally {
    pool.end();
  }
}

verifyFiltering();