const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkSchema() {
  try {
    console.log('START DEBUG');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'appointments';
    `);
    console.log('COLUMNS:', result.rows.map(r => `${r.column_name}(${r.data_type}, nullable:${r.is_nullable})`).join(', '));
  } catch (error) {
    console.error('Error querying schema:', error);
  } finally {
    pool.end();
  }
}

checkSchema();
