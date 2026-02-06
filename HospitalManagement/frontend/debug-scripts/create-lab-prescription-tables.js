const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function runMigration() {
    try {
        console.log('--- CREATING PRESCRIPTIONS & LAB TABLES ---');

        // 1. Prescriptions Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS prescriptions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                patient_id UUID NOT NULL REFERENCES patients(id),
                patient_name VARCHAR(255),
                medication_name VARCHAR(255) NOT NULL,
                dosage VARCHAR(100) NOT NULL,
                frequency VARCHAR(100) NOT NULL,
                duration VARCHAR(100) NOT NULL,
                prescribed_by VARCHAR(255),
                prescribed_date DATE DEFAULT CURRENT_DATE,
                status VARCHAR(50) DEFAULT 'active',
                refills_remaining INTEGER DEFAULT 0,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Success: prescriptions table ensured.');

        // 2. Lab Tests Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lab_tests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                patient_id UUID NOT NULL REFERENCES patients(id),
                patient_name VARCHAR(255),
                test_name VARCHAR(255) NOT NULL,
                test_type VARCHAR(100) NOT NULL,
                ordered_by VARCHAR(255),
                ordered_date DATE DEFAULT CURRENT_DATE,
                status VARCHAR(50) DEFAULT 'ordered',
                result TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Success: lab_tests table ensured.');

        console.log('--- MIGRATION COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

runMigration();
