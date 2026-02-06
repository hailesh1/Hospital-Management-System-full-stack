const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: parseInt(process.env.DB_PORT || '5432'),
    connectionTimeoutMillis: 5000,
});

async function optimizeDb() {
    try {
        console.log('--- STARTING DATABASE OPTIMIZATION ---');

        const indexes = [
            // Appointments
            'CREATE INDEX IF NOT EXISTS idx_appointments_date_only ON appointments(date)',
            'CREATE INDEX IF NOT EXISTS idx_appointments_created_at_date ON appointments(created_at)',

            // Staff
            'CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status)',
            'CREATE INDEX IF NOT EXISTS idx_staff_role_lower ON staff(lower(role))',
            'CREATE INDEX IF NOT EXISTS idx_staff_dept_id ON staff(department_id)',

            // Patients
            'CREATE INDEX IF NOT EXISTS idx_patients_status_lower ON patients(lower(status))',
            'CREATE INDEX IF NOT EXISTS idx_patients_reg_date ON patients(registered_date)',

            // Medical Records
            'ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS type VARCHAR(50)',
            'CREATE INDEX IF NOT EXISTS idx_medical_records_type_lower ON medical_records(lower(type))',

            // Invoices
            'CREATE INDEX IF NOT EXISTS idx_invoices_status_lower ON invoices(lower(status))',
            'CREATE INDEX IF NOT EXISTS idx_invoices_created_at_date ON invoices(created_at)',
        ];

        for (const query of indexes) {
            console.log(`Executing: ${query}`);
            await pool.query(query);
        }

        console.log('--- DATABASE OPTIMIZATION COMPLETE ---');
    } catch (err) {
        console.error('Optimization Error:', err.message);
    } finally {
        await pool.end();
    }
}

optimizeDb();
