const { query } = require('./lib/db');

async function checkSchema() {
  try {
    const result = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments';
    `);
    console.log('Columns in appointments table:');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });
  } catch (error) {
    console.error('Error querying schema:', error);
  } finally {
    process.exit();
  }
}

checkSchema();
