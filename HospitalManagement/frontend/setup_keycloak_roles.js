const { query } = require('./lib/db');

// Configuration
const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'HMS';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';

// Users to setup
const USERS = [
    {
        username: 'akelilu',
        firstName: 'Akelilu',
        lastName: 'Besufekad',
        email: 'akelilu@example.com',
        password: 'password123',
        role: 'patient',
        attributes: { phone: '0912345678' }
    },
    {
        username: 'doctor_smith',
        firstName: 'John',
        lastName: 'Smith',
        email: 'dr.smith@hospital.com',
        password: 'password123',
        role: 'doctor',
        attributes: { specialization: 'General' }
    },
    {
        username: 'reception_jane',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'reception@hospital.com',
        password: 'password123',
        role: 'receptionist',
        attributes: {}
    },
    {
        username: 'dawit.kebede',
        firstName: 'Dawit',
        lastName: 'Kebede',
        email: 'dawit.kebede@hms.com',
        password: 'password123',
        role: 'doctor',
        attributes: { specialization: 'Cardiologist' }
    }
];


async function setupKeycloak() {
    console.log('🚀 Starting Keycloak Role & User Setup...');

    try {
        // 1. Get Admin Token
        const token = await getAdminToken();
        console.log('✅ Admin Token Acquired');

        // 2. Ensure Roles Exist
        const roles = ['patient', 'doctor', 'receptionist', 'admin'];
        for (const role of roles) {
            await ensureRoleExists(token, role);
        }

        // 2.5 Ensure Protocol Mapper (so roles appear in Token)
        await ensureProtocolMapper(token);


        // 3. Process Users
        for (const user of USERS) {
            console.log(`\n👤 Processing user: ${user.username} (${user.role})...`);

            // Create or Get User
            let userId = await getUserId(token, user.username);
            if (!userId) {
                userId = await createUser(token, user);
                console.log(`   ✅ Created new user (ID: ${userId})`);
            } else {
                console.log(`   ℹ️ User exists (ID: ${userId})`);
            }

            // Assign Role
            await assignRole(token, userId, user.role);
            console.log(`   ✅ Assigned role: ${user.role}`);

            // Sync with DB
            await syncDatabase(userId, user);
        }

        console.log('\n🎉 VALIDATION COMPLETE');
        console.log('You can now login with:');
        USERS.forEach(u => console.log(`- ${u.username} / ${u.password} -> Should redirect to ${u.role} dashboard`));

    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
        if (error.cause) console.error('   Cause:', error.cause);
    }
}

// --- Helper Functions ---

async function getAdminToken() {
    const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: 'admin-cli',
            username: ADMIN_USER,
            password: ADMIN_PASS,
            grant_type: 'password'
        })
    });
    if (!res.ok) throw new Error('Failed to get admin token. Is Keycloak running?');
    const data = await res.json();
    return data.access_token;
}

async function ensureRoleExists(token, roleName) {
    // Check if role exists
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${roleName}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 404) {
        process.stdout.write(`   Creating role '${roleName}'... `);
        const createRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/roles`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: roleName })
        });
        if (!createRes.ok) throw new Error(`Failed to create role ${roleName}`);
        console.log('Done');
    }
}

async function getUserId(token, username) {
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const users = await res.json();
    return users.length > 0 ? users[0].id : null;
}

async function createUser(token, user) {
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            enabled: true,
            emailVerified: true,
            credentials: [{ type: 'password', value: user.password, temporary: false }],
            attributes: user.attributes
        })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create user ${user.username}: ${text}`);
    }

    return await getUserId(token, user.username);
}

async function assignRole(token, userId, roleName) {
    // Get role ID first
    const roleRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${roleName}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const roleData = await roleRes.json();

    // Assign it
    const assignRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ id: roleData.id, name: roleData.name }])
    });

    if (!assignRes.ok) throw new Error(`Failed to assign role ${roleName}`);
}

async function syncDatabase(userId, user) {
    if (user.role === 'patient') {
        process.stdout.write(`   Syncing Patient DB... `);
        // Sync logic for patients (Akelilu)
        const oldId = `dev-${user.username}`.replace('dev-akelilu', 'dev-akelilu@example.com'); // Hack for specific case if needed, or just use email lookup

        // Try strict ID replacement first
        await query(`UPDATE patients SET id = $1 WHERE email = $2`, [userId, user.email]);

        // Also fix FKs if any were left pointing to old IDs
        // (Assuming main migration was done, but let's be safe)
        const tables = ['medical_records', 'prescriptions', 'lab_tests', 'invoices', 'appointments'];
        for (const table of tables) {
            await query(`UPDATE ${table} SET patient_id = $1 WHERE patient_id IN (SELECT id FROM patients WHERE email = $2)`, [userId, user.email]);
        }
        console.log('Done');
    } else if (user.role === 'doctor') {
        process.stdout.write(`   Syncing Doctor DB... `);
        // Ensure doctor exists in 'staff' table
        // First check if staff exists
        const staffRes = await query(`SELECT id FROM staff WHERE email = $1`, [user.email]);
        if (staffRes.rows.length === 0) {
            await query(`
                INSERT INTO staff (id, first_name, last_name, email, role, specialization, status, join_date, availability_status, phone)
                VALUES ($1, $2, $3, $4, 'DOCTOR', $5, 'ACTIVE', CURRENT_DATE, 'AVAILABLE', '0900000000')
            `, [userId, user.firstName, user.lastName, user.email, user.attributes.specialization]);
        } else {



            await query(`UPDATE staff SET id = $1 WHERE email = $2`, [userId, user.email]);
        }
        console.log('Done');
    }
}


async function ensureProtocolMapper(token) {
    // 1. Get Client ID (not clientId string, but the UUID)
    const clientsRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients?clientId=hms-client`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const clients = await clientsRes.json();
    if (clients.length === 0) {
        console.log('⚠️ hms-client not found, skipping mapper setup.');
        return;
    }
    const clientUUID = clients[0].id;

    // 2. Check for existing mapper
    const mappersRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients/${clientUUID}/protocol-mappers/models`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const mappers = await mappersRes.json();
    const existing = mappers.find(m => m.name === 'realm roles');

    if (!existing) {
        process.stdout.write(`   Creating Protocol Mapper for Roles... `);
        const mapper = {
            name: "realm roles",
            protocol: "openid-connect",
            protocolMapper: "oidc-usermodel-realm-role-mapper",
            consentRequired: false,
            config: {
                "multivalued": "true",
                "user.attribute": "roles",
                "id.token.claim": "true",
                "access.token.claim": "true",
                "claim.name": "roles",
                "jsonType.label": "String"
            }
        };

        await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients/${clientUUID}/protocol-mappers/models`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mapper)
        });
        console.log('Done');
    }
}

setupKeycloak();

