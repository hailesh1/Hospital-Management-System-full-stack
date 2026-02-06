const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env
dotenv.config();

// Create pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
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
