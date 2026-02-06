const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

async function createTable() {
    console.log('Creating time_off_requests table...');
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS time_off_requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                staff_id UUID REFERENCES staff(id),
                staff_name VARCHAR(255),
                type VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('Table created successfully.');
    } catch (e) {
        console.error('Error creating table:', e);
    } finally {
        await pool.end();
    }
}

createTable();
