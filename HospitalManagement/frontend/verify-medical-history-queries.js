const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function verifyQueries() {
  const patientId = 1; // Assuming patient ID 1 exists, or just use it to test syntax
  
  try {
    console.log("Testing Visits Fallback Query...");
    const visitsRes = await pool.query(
        `SELECT 
            mr.id,
            mr.date,
            '' as symptoms,
            mr.diagnosis,
            mr.treatment,
            '' as notes,
            COALESCE(mr.doctor_name, s.first_name || ' ' || s.last_name, 'Unknown Doctor') as doctor,
            'General Checkup' as type
          FROM medical_records mr
          LEFT JOIN staff s ON mr.doctor_id::text = s.id::text
          WHERE mr.patient_id = $1
          ORDER BY mr.date DESC
          LIMIT 10`,
        [patientId]
    );
    console.log("Visits Fallback Query Success. Rows:", visitsRes.rowCount);

    console.log("Testing Vaccinations Fallback Query...");
    const vaxRes = await pool.query(
        `SELECT 
            COALESCE(diagnosis, treatment, 'Vaccination') as name,
            date
          FROM medical_records
          WHERE patient_id = $1 
          AND (
            (diagnosis IS NOT NULL AND LOWER(diagnosis) LIKE '%vaccin%') OR 
            (treatment IS NOT NULL AND LOWER(treatment) LIKE '%vaccin%')
          )
          ORDER BY date DESC
          LIMIT 10`,
        [patientId]
    );
    console.log("Vaccinations Fallback Query Success. Rows:", vaxRes.rowCount);

  } catch (err) {
    console.error('Query Verification Failed:', err);
  } finally {
    pool.end();
  }
}

verifyQueries();
