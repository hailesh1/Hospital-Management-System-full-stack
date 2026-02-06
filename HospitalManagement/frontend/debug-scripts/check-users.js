const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
});

async function checkUsers() {
    try {
        const res = await pool.query("SELECT username, email, role, password_hash FROM users WHERE role = 'admin'");
        if (res.rows.length === 0) {
            console.log("No admin users found.");
            // Create a default admin
            const insertRes = await pool.query(
                "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
                ['admin', 'admin@hospital.com', 'admin123', 'admin']
            );
            console.log("Created default admin user:");
            console.log("Username: admin");
            console.log("Email: admin@hospital.com");
            console.log("Password: admin123 (Note: This is plain text for now, ideally should be hashed)");
        } else {
            console.log("Existing Admin Users:");
            res.rows.forEach(u => {
                console.log(`Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`);
            });
        }
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err.message);
        process.exit(1);
    }
}

checkUsers();
