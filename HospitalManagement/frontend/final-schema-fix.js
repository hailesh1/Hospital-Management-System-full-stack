const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function runFix() {
    try {
        console.log('--- STARTING FINAL SCHEMA ALIGNMENT ---');

        // 1. Appointments Table
        console.log('Checking appointments table...');
        await pool.query(`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE,
            ADD COLUMN IF NOT EXISTS time VARCHAR(50),
            ADD COLUMN IF NOT EXISTS type VARCHAR(100),
            ADD COLUMN IF NOT EXISTS reason TEXT;
            
            ALTER TABLE appointments ALTER COLUMN appointment_date DROP NOT NULL;
            ALTER TABLE appointments ALTER COLUMN date SET DEFAULT CURRENT_DATE;
        `);
        console.log('Success: appointments table columns ensured.');

        // 2. Medical Records Table
        console.log('Checking medical_records table...');
        await pool.query(`
            ALTER TABLE medical_records 
            ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS doctor_id VARCHAR(100),
            ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS title VARCHAR(255),
            ADD COLUMN IF NOT EXISTS type VARCHAR(50),
            ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS notes TEXT,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
            
            -- Ensure dates have defaults and aren't blocking if null is sent
            ALTER TABLE medical_records ALTER COLUMN created_at SET DEFAULT NOW();
            ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS date TIMESTAMP DEFAULT NOW();
            ALTER TABLE medical_records ALTER COLUMN date SET DEFAULT NOW();
        `);
        console.log('Success: medical_records table columns ensured.');

        // 3. Prescriptions Table
        console.log('Checking prescriptions table...');
        await pool.query(`
            ALTER TABLE prescriptions 
            ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS medication_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
            ADD COLUMN IF NOT EXISTS prescribed_date DATE DEFAULT CURRENT_DATE;

            -- Fix potential NOT NULL violations
            ALTER TABLE prescriptions ALTER COLUMN medication_name DROP NOT NULL;
            ALTER TABLE prescriptions ALTER COLUMN dosage DROP NOT NULL;
            ALTER TABLE prescriptions ALTER COLUMN frequency DROP NOT NULL;
            ALTER TABLE prescriptions ALTER COLUMN duration DROP NOT NULL;
            ALTER TABLE prescriptions ALTER COLUMN prescribed_date SET DEFAULT CURRENT_DATE;
        `);
        console.log('Success: prescriptions table columns ensured.');

        // 4. Lab Tests Table
        console.log('Checking lab_tests table...');
        await pool.query(`
            ALTER TABLE lab_tests 
            ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ordered',
            ADD COLUMN IF NOT EXISTS ordered_date DATE DEFAULT CURRENT_DATE;

            ALTER TABLE lab_tests ALTER COLUMN ordered_date SET DEFAULT CURRENT_DATE;
            ALTER TABLE lab_tests ALTER COLUMN ordered_date DROP NOT NULL;
            ALTER TABLE lab_tests ALTER COLUMN test_name DROP NOT NULL;
            ALTER TABLE lab_tests ALTER COLUMN test_type DROP NOT NULL;
        `);
        console.log('Success: lab_tests table columns ensured.');

        // 5. Patients Table
        console.log('Checking patients table...');
        await pool.query(`
            ALTER TABLE patients ALTER COLUMN status SET DEFAULT 'Active';
            ALTER TABLE patients ALTER COLUMN status DROP NOT NULL;
            ALTER TABLE patients ALTER COLUMN first_name DROP NOT NULL;
            ALTER TABLE patients ALTER COLUMN last_name DROP NOT NULL;
            ALTER TABLE patients ALTER COLUMN gender DROP NOT NULL;
        `);
        console.log('Success: patients table constraints loosened.');

        // 6. Staff Table
        console.log('Checking staff table...');
        await pool.query(`
            ALTER TABLE staff ALTER COLUMN status SET DEFAULT 'ACTIVE';
            ALTER TABLE staff ALTER COLUMN role DROP NOT NULL;
            ALTER TABLE staff ALTER COLUMN first_name DROP NOT NULL;
            ALTER TABLE staff ALTER COLUMN last_name DROP NOT NULL;
        `);
        console.log('Success: staff table constraints loosened.');

        // 7. Invoices Table
        console.log('Checking invoices table...');
        await pool.query(`
            ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'UNPAID';
            ALTER TABLE invoices ALTER COLUMN created_at SET DEFAULT NOW();
            ALTER TABLE invoices ALTER COLUMN total DROP NOT NULL;
        `);
        console.log('Success: invoices table constraints loosened.');

        console.log('--- SCHEMA ALIGNMENT COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

runFix();
