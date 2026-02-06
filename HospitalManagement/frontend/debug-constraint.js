
console.log("Starting script...");
try {
    const pg = require('pg');
    console.log("pg required successfully");
    const { Pool } = pg;
    console.log("Pool extracted");

    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'hospital_management',
      password: process.env.DB_PASSWORD || '1234',
      port: process.env.DB_PORT || 5432,
    });
    console.log("Pool created");

    pool.query("SELECT 1", (err, res) => {
        if (err) {
            console.error("Connection error:", err);
        } else {
            console.log("Connection successful, result:", res.rows);
            
            pool.query("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE conrelid = 'invoices'::regclass AND conname ILIKE '%status%'", (err, res) => {
                if (err) console.error("Query error:", err);
                else {
                    console.log("Constraint def rows:", res.rows);
                }
                pool.end();
            });
        }
    });

} catch (e) {
    console.error("Top level error:", e);
}
