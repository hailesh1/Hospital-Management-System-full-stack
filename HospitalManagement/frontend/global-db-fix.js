const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'hospital_management',
    password: '1234',
    port: 5432,
});

const updates = [
    {
        table: 'invoices',
        constraint: 'invoices_status_check',
        allowed: ['PAID', 'PENDING', 'OVERDUE', 'CANCELLED', 'paid', 'pending', 'overdue', 'cancelled']
    },
    {
        table: 'prescriptions',
        constraint: 'prescriptions_status_check',
        allowed: ['ACTIVE', 'COMPLETED', 'DISCONTINUED', 'active', 'completed', 'cancelled']
    },
    {
        table: 'insurance_claims',
        constraint: 'insurance_claims_status_check',
        allowed: ['PENDING', 'APPROVED', 'REJECTED', 'Pending', 'Approved', 'Rejected']
    },
    {
        table: 'users',
        constraint: 'users_role_check',
        allowed: ['ADMIN', 'DOCTOR', 'NURSE', 'STAFF', 'admin', 'doctor', 'nurse', 'staff', 'RECEPTIONIST']
    }
];

async function run() {
    try {
        console.log('--- STARTING GLOBAL CASE-SENSITIVITY FIX ---');

        for (const update of updates) {
            console.log(`Fixing ${update.table}.${update.constraint}...`);
            await pool.query(`ALTER TABLE ${update.table} DROP CONSTRAINT IF EXISTS ${update.constraint} CASCADE`);

            const list = update.allowed.map(v => `'${v}'`).join(', ');
            await pool.query(`ALTER TABLE ${update.table} ADD CONSTRAINT ${update.constraint} CHECK (status IN (${list}))`).catch(async (e) => {
                // Handle tables where the column name might be 'role' or something else
                if (update.table === 'users') {
                    await pool.query(`ALTER TABLE ${update.table} ADD CONSTRAINT ${update.constraint} CHECK (role IN (${list}))`);
                } else {
                    throw e;
                }
            });
            console.log(`Success for ${update.table}`);
        }

        console.log('--- GLOBAL FIX COMPLETE ---');
    } catch (err) {
        console.error('Migration Error:', err.message);
    } finally {
        await pool.end();
    }
}

run();
