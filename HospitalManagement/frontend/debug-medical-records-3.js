const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkColumns() {
  try {
    const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
    `);
    const columns = res.rows.map(r => r.column_name);
    console.log('Columns in medical_records:', columns);
    
    const checkCol = (name) => console.log(`Column '${name}' exists:`, columns.includes(name));
    
    checkCol('type');
    checkCol('title');
    checkCol('symptoms');
    checkCol('notes');
    checkCol('diagnosis');
    checkCol('treatment');

  } catch (err) {
    console.error('Error checking columns:', err);
  } finally {
    pool.end();
  }
}

checkColumns();
