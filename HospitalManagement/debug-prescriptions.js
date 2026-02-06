const { query } = require('./frontend/lib/db');

async function checkPrescriptionsSchema() {
  try {
    const cols = await query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'prescriptions'
      ORDER BY ordinal_position
    `);
    console.log('Columns:', JSON.stringify(cols.rows, null, 2));

    const cons = await query(`
      SELECT tc.constraint_name, tc.constraint_type
      FROM information_schema.table_constraints tc
      WHERE tc.table_name='prescriptions'
    `);
    console.log('Constraints:', JSON.stringify(cons.rows, null, 2));
  } catch (e) {
    console.error(e);
  }
}

checkPrescriptionsSchema();
