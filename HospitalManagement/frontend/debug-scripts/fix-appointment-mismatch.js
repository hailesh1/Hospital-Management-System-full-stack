const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function fixMismatch() {
    try {
        console.log('Resolving all type mismatches for appointments table...');

        // Find all foreign keys referencing appointments(id)
        const findFKs = `
            SELECT 
                tc.table_name, 
                tc.constraint_name, 
                kcu.column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name='appointments' AND ccu.column_name='id';
        `;

        const fksRes = await pool.query(findFKs);
        const fks = fksRes.rows;

        console.log('Found following foreign keys referencing appointments(id):');
        console.table(fks);

        // 1. Drop all these foreign keys
        for (const fk of fks) {
            console.log(`Dropping constraint ${fk.constraint_name} on table ${fk.table_name}...`);
            await pool.query(`ALTER TABLE ${fk.table_name} DROP CONSTRAINT IF EXISTS ${fk.constraint_name}`);
        }

        // 2. Convert appointments.id to VARCHAR
        console.log('Converting appointments.id to VARCHAR(255)...');
        await pool.query(`ALTER TABLE appointments ALTER COLUMN id TYPE VARCHAR(255) USING id::TEXT`);

        // 3. Convert all referencing columns to VARCHAR
        for (const fk of fks) {
            console.log(`Converting ${fk.table_name}.${fk.column_name} to VARCHAR(255)...`);
            await pool.query(`ALTER TABLE ${fk.table_name} ALTER COLUMN ${fk.column_name} TYPE VARCHAR(255) USING ${fk.column_name}::TEXT`);
        }

        console.log('Success: All type mismatches resolved.');
        console.log('Hibernate will now be able to recreate the constraints on next startup.');

    } catch (err) {
        console.error('Error fixing mismatch:', err.message);
    } finally {
        await pool.end();
    }
}

fixMismatch();
