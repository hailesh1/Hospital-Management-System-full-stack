require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

async function testQuery() {
    try {
        const text = `
          SELECT 
            mr.id,
            mr.patient_id as "patientId",
            p.first_name || ' ' || p.last_name as patient,
            mr.date,
            COALESCE(mr.title, mr.diagnosis, mr.symptoms, 'Medical Record') as title,
            mr.notes as description,
            COALESCE(mr.type, 'consultation') as type,
            COALESCE(mr.file_name, '') as "fileName"
          FROM medical_records mr
          LEFT JOIN patients p ON mr.patient_id = p.id
          ORDER BY mr.date DESC
        `;
        console.log('Running query...');
        const res = await pool.query(text);
        console.log('Success!', res.rows.length, 'rows');
    } catch (err) {
        console.error('Query Error:', err.message);
    } finally {
        pool.end();
    }
}

testQuery();
