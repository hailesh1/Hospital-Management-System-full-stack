const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/hospital_db"
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database');

        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS time_off_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        staff_id UUID NOT NULL REFERENCES staff(id),
        staff_name TEXT NOT NULL,
        type TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

        await client.query(createTableQuery);
        console.log('Table "time_off_requests" created or already exists');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
