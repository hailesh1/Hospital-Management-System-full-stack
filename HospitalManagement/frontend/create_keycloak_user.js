const { query } = require('./lib/db');

// Configuration
const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'HMS';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

// User Details
const USER_DATA = {
    username: 'akelilu',
    firstName: 'Akelilu',
    lastName: 'Besufekad',
    email: 'akelilu@example.com',
    enabled: true,
    emailVerified: true,
    credentials: [{
        type: 'password',
        value: 'password123',
        temporary: false
    }]
};

async function createKeycloakUser() {
    console.log('🚀 Starting Keycloak User Creation & Sync...');

    try {
        // 1. Get Admin Token
        console.log('🔑 Authenticating with Keycloak...');
        const tokenRes = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: 'admin-cli',
                username: ADMIN_USER,
                password: ADMIN_PASS,
                grant_type: 'password'
            })
        });

        if (!tokenRes.ok) throw new Error(`Auth failed: ${tokenRes.statusText}`);
        const { access_token } = await tokenRes.json();

        // 2. Check if user exists
        console.log('🔍 Checking for existing user...');
        const searchRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${USER_DATA.username}`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const existingUsers = await searchRes.json();

        let userId;

        if (existingUsers.length > 0) {
            console.log('ℹ️ User already exists in Keycloak.');
            userId = existingUsers[0].id;
        } else {
            // 3. Create User
            console.log('👤 Creating new user...');
            const createRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(USER_DATA)
            });

            if (!createRes.ok && createRes.status !== 409) {
                const errText = await createRes.text();
                throw new Error(`Failed to create user: ${errText}`);
            }

            // 4. Get New User ID
            const newSearchRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${USER_DATA.username}`, {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            const newUsers = await newSearchRes.json();
            userId = newUsers[0].id;
        }

        console.log(`✅ Keycloak User ID: ${userId}`);

        // 5. Sync Database
        console.log('🔄 Syncing PostgreSQL database...');

        // Update users table match
        // We'll update the record that currently holds 'dev-akelilu@example.com' or the email
        // Logic: Find patient by email, update ID to Keycloak ID.
        // Also update all foreign keys.

        const oldId = 'dev-akelilu@example.com';

        // a) Check if we have data under old ID
        const checkOld = await query('SELECT id FROM patients WHERE id = $1', [oldId]);

        if (checkOld.rows.length > 0) {
            console.log(`   Found data under '${oldId}'. Migrating to '${userId}'...`);

            // If target ID already exists (maybe from previous run), delete it first to avoid collision? No, we merge.
            // But usually UUID won't collide with dev ID.

            // Update FKs first
            const tables = ['medical_records', 'prescriptions', 'lab_tests', 'invoices', 'appointments'];
            for (const table of tables) {
                await query(`UPDATE ${table} SET patient_id = $1 WHERE patient_id = $2`, [userId, oldId]);
            }

            // Now update Patient record
            // But wait, if userId record ALREADY exists in DB (from auto-sync), we should update THAT one and delete old one
            const checkNew = await query('SELECT id FROM patients WHERE id = $1', [userId]);

            if (checkNew.rows.length > 0) {
                console.log(`   Target patient record ${userId} already exists. Deleting '${oldId}'...`);
                await query('DELETE FROM patients WHERE id = $1', [oldId]);
            } else {
                console.log(`   Updating patient ID from '${oldId}' to '${userId}'...`);
                await query('UPDATE patients SET id = $1 WHERE id = $2', [userId, oldId]);
            }
        } else {
            console.log(`   No data found under '${oldId}'. Checking by email...`);
            // Check by email just in case
            const mailRes = await query('SELECT id FROM patients WHERE email = $1 AND id != $2', [USER_DATA.email, userId]);
            if (mailRes.rows.length > 0) {
                const linkId = mailRes.rows[0].id;
                console.log(`   Found record by email with ID '${linkId}'. Migrating...`);
                // Similar migration logic...
                const tables = ['medical_records', 'prescriptions', 'lab_tests', 'invoices', 'appointments'];
                for (const table of tables) {
                    await query(`UPDATE ${table} SET patient_id = $1 WHERE patient_id = $2`, [userId, linkId]);
                }
                await query('UPDATE patients SET id = $1 WHERE id = $2', [userId, linkId]);
            } else {
                console.log('   No orphaned data found to migrate.');
            }
        }

        console.log('🎉 SUCCESS! Account created and data synced.');
        console.log(`👉 Login: ${USER_DATA.username} / password123`);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createKeycloakUser();
