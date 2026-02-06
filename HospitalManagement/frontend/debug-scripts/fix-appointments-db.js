const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fixAppointments() {
    try {
        console.log('Aligning appointments table with Java entity...');

        // 1. Make appointment_date nullable (Hibernate uses 'date' column)
        await pool.query('ALTER TABLE appointments ALTER COLUMN appointment_date DROP NOT NULL');
        console.log('Made appointment_date nullable.');

        // 2. Drop the FK constraint on doctor_id that points to 'doctors' table
        // We first find the constraint name
        const fkRes = await pool.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'appointments' AND constraint_type = 'FOREIGN KEY' AND constraint_name LIKE '%doctor_id%'
        `);

        for (const row of fkRes.rows) {
            console.log(`Dropping FK: ${row.constraint_name}`);
            await pool.query(`ALTER TABLE appointments DROP CONSTRAINT IF EXISTS "${row.constraint_name}"`);
        }

        // 3. Ensure doctor_id is VARCHAR(255) (to match Staff ID)
        await pool.query('ALTER TABLE appointments ALTER COLUMN doctor_id TYPE VARCHAR(255)');
        console.log('Converted doctor_id to VARCHAR(255).');

        console.log('Success: Appointments table aligned.');
    } catch (err) {
        console.error('Error fixing appointments table:', err.message);
    } finally {
        await pool.end();
    }
}

fixAppointments();
