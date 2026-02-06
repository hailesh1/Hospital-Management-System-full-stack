import db from './lib/db.js';

async function createTable() {
    try {
        console.log('Creating time_off_requests table...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS time_off_requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                staff_id UUID NOT NULL REFERENCES staff(id),
                staff_name VARCHAR(255),
                type VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                reason TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Table time_off_requests created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createTable();
