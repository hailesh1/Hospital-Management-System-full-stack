const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function migrate() {
    try {
        console.log('--- STARTING COMPREHENSIVE UUID TO VARCHAR(255) MIGRATION ---');

        // 1. Find all UUID columns
        const colRes = await pool.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE data_type = 'uuid' AND table_schema = 'public'
        `);
        const uuidCols = colRes.rows;
        console.log(`Found ${uuidCols.length} UUID columns.`);

        // 2. Find all Foreign Keys involving these tables
        const fkRes = await pool.query(`
            SELECT tc.table_name, tc.constraint_name
            FROM information_schema.table_constraints AS tc
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
        `);
        const fks = fkRes.rows;
        console.log(`Found ${fks.length} foreign key constraints to drop.`);

        // 3. Drop all Foreign Keys temporarily
        for (const fk of fks) {
            console.log(`Dropping FK: ${fk.constraint_name} on ${fk.table_name}...`);
            await pool.query(`ALTER TABLE "${fk.table_name}" DROP CONSTRAINT IF EXISTS "${fk.constraint_name}"`);
        }

        // 4. Alter all UUID columns to VARCHAR(255)
        for (const col of uuidCols) {
            console.log(`Altering ${col.table_name}.${col.column_name} to VARCHAR(255)...`);
            // We use USING column::TEXT to cast existing UUIDs
            await pool.query(`ALTER TABLE "${col.table_name}" ALTER COLUMN "${col.column_name}" TYPE VARCHAR(255) USING "${col.column_name}"::TEXT`);
        }

        console.log('--- MIGRATION FINISHED SUCCESSFULLY ---');
        console.log('Note: Hibernate (ddl-auto: update) will recreate the foreign key constraints on the next backend startup.');

    } catch (err) {
        console.error('CRITICAL ERROR DURING MIGRATION:', err.message);
    } finally {
        await pool.end();
    }
}

migrate();
