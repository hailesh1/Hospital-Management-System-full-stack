const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function verifySchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
    `);
    
    const cols = {};
    res.rows.forEach(r => cols[r.column_name] = r.is_nullable);
    
    console.log('Columns:', Object.keys(cols));
    console.log('Title exists:', !!cols.title);
    console.log('Type exists:', !!cols.type);
    console.log('Diagnosis nullable:', cols.diagnosis);
    console.log('Treatment nullable:', cols.treatment);

  } catch (err) {
    console.error('Error checking columns:', err);
  } finally {
    pool.end();
  }
}

verifySchema();
