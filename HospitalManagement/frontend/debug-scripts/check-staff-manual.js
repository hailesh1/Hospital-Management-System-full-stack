const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envFile.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim();
            }
        });
        return env;
    } catch (e) {
        console.error('Could not read .env file', e);
        return {};
    }
}

const env = loadEnv();

const pool = new Pool({
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || '1234',
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '5432'),
    database: env.DB_NAME || 'hospital_management',
});

async function run() {
    try {
        console.log('Checking staff status...');
        const res = await pool.query("SELECT id, first_name, last_name, role, status FROM staff WHERE role ILIKE '%doctor%' OR role ILIKE '%specialist%'");
        console.table(res.rows);
        await pool.end();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
