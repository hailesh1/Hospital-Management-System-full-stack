import { query } from './lib/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateSchema() {
    try {
        console.log('Starting schema update...');
        console.log(`Connecting to database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);

        // Read schema file
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Drop existing tables in correct order (reverse of foreign key dependencies)
        console.log('Dropping existing tables...');
        await query('DROP TABLE IF EXISTS invoice_items CASCADE');
        await query('DROP TABLE IF EXISTS invoices CASCADE');
        await query('DROP TABLE IF EXISTS prescriptions CASCADE');
        await query('DROP TABLE IF EXISTS medical_records CASCADE');
        await query('DROP TABLE IF EXISTS vital_signs CASCADE');
        await query('DROP TABLE IF EXISTS appointments CASCADE');
        await query('DROP TABLE IF EXISTS patients CASCADE');
        console.log('Existing tables dropped successfully');

        console.log('Applying new schema...');
        await query(schema);

        console.log('\n✓ Schema updated successfully!');
        console.log('✓ Patients table: UUID, first_name, last_name, blood_type, status, registered_date');
        console.log('✓ Invoices and invoice_items tables created');
        console.log('✓ All indexes created\n');
        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error.message);
        process.exit(1);
    }
}

updateSchema();
