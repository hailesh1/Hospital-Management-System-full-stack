const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: 'yourpassword',
    port: 5432,
});

async function fixInvoiceStatusConstraint() {
    try {
        console.log('Dropping invoices_status_check constraint...');
        await pool.query('ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_status_check');
        console.log('✅ Success: Invoice status constraint removed.');
        console.log('Invoices can now be created with any status value (pending, paid, cancelled, etc.)');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

fixInvoiceStatusConstraint();
