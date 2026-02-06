
const { query } = require('./frontend/lib/db');

async function checkSchema() {
  try {
    const res = await query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'medical_records'
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    
    // Also check extensions
    const ext = await query("SELECT * FROM pg_extension WHERE extname = 'uuid-ossp'");
    console.log('Extensions:', JSON.stringify(ext.rows, null, 2));

  } catch (err) {
    console.error(err);
  }
}

checkSchema();
