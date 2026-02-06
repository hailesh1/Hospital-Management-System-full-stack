const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hospital_management',
    password: process.env.DB_PASSWORD || 'yourpassword',
    port: process.env.DB_PORT || 5432,
});

async function listAll() {
    try {
        const res = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position
    `);

        const tables = {};
        res.rows.forEach(row => {
            if (!tables[row.table_name]) tables[row.table_name] = [];
            tables[row.table_name].push(row.column_name);
        });

        console.log('Database Schema:', JSON.stringify(tables, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

listAll();
