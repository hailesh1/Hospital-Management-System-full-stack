import { query } from './lib/db.js';

async function verifyAndMigrate() {
    try {
        console.log('Verifying and migrating schema for Claims and Messages...');

        // Insurance Claims
        await query(`
      CREATE TABLE IF NOT EXISTS insurance_claims (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
        provider VARCHAR(100) NOT NULL,
        policy_number VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ insurance_claims table ready');

        // Messages
        await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id VARCHAR(100) NOT NULL,
        receiver_id VARCHAR(100) NOT NULL,
        receiver_role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ messages table ready');

        // Indexes
        await query('CREATE INDEX IF NOT EXISTS idx_insurance_claims_patient_id ON insurance_claims(patient_id)');
        await query('CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id)');
        await query('CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)');

        console.log('✅ Indexes created');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

verifyAndMigrate();
