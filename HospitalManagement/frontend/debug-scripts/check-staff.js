import { query } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkStaff() {
    try {
        console.log('Checking staff table for doctors...');
        const result = await query(`
      SELECT id, first_name, last_name, role, status 
      FROM staff 
      WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%'
    `);

        console.table(result.rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkStaff();
