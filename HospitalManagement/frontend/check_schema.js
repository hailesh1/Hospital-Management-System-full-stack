const { query } = require('./lib/db');

async function checkSchema() {
  try {
    const res = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'appointments'
        `);
    console.log('--- Appointments Schema ---');
    res.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));
  } catch (e) {
    console.error(e);
  }
}
checkSchema();
