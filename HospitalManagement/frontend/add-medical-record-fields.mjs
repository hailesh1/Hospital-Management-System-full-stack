import { query } from './lib/db.js';
// import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.resolve(__dirname, '.env') });

async function run() {
    try {
        console.log("Adding columns to medical_records...");

        await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS title VARCHAR(255);`);
        console.log("Added title column.");

        await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS type VARCHAR(50);`);
        console.log("Added type column.");

        await query(`ALTER TABLE medical_records ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);`);
        console.log("Added file_name column.");

        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("Error migrating:", e);
        process.exit(1);
    }
}

run();
