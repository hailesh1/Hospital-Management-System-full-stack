const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

async function checkConstraint() {
  try {
    const result = await pool.query(`
      SELECT pg_get_constraintdef(oid) as constraint_def
      FROM pg_constraint
      WHERE conname = 'appointments_type_check';
    `);
    
    if (result.rows.length > 0) {
        console.log('Constraint definition:', result.rows[0].constraint_def);
    } else {
        console.log('Constraint not found via pg_constraint. Checking information_schema...');
        const infoSchema = await pool.query(`
            SELECT check_clause 
            FROM information_schema.check_constraints 
            WHERE constraint_name = 'appointments_type_check'
        `);
        console.log('Check clause:', infoSchema.rows[0]?.check_clause);
    }

  } catch (error) {
    console.error('Error querying constraint:', error);
  } finally {
    pool.end();
  }
}

checkConstraint();
