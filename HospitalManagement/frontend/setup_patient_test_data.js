const { query } = require('./lib/db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupTestData() {
  try {
    console.log('\n🏥 HOSPITAL MANAGEMENT SYSTEM - TEST DATA SETUP\n');
    console.log('═'.repeat(80));

    // Step 1: List all patients
    console.log('\n📋 Step 1: Available Patients\n');
    const patientsResult = await query(`
      SELECT id, first_name, last_name, email, phone
      FROM patients
      ORDER BY first_name, last_name
    `);

    if (patientsResult.rows.length === 0) {
      console.log('❌ No patients found. Please add patients first.');
      rl.close();
      return;
    }

    patientsResult.rows.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.first_name} ${patient.last_name} (${patient.email})`);
      console.log(`   ID: ${patient.id}`);
    });

    // Step 2: Select patient
    const patientChoice = await askQuestion('\n👤 Enter patient number to use for testing: ');
    const selectedPatient = patientsResult.rows[parseInt(patientChoice) - 1];

    if (!selectedPatient) {
      console.log('❌ Invalid selection.');
      rl.close();
      return;
    }

    console.log(`\n✅ Selected: ${selectedPatient.first_name} ${selectedPatient.last_name}`);
    console.log(`   Patient ID: ${selectedPatient.id}\n`);

    // Step 3: Get a doctor
    console.log('👨‍⚕️ Step 2: Finding a doctor...\n');
    const doctorResult = await query(`
      SELECT id, first_name, last_name, specialization
      FROM staff
      WHERE role ILIKE '%doctor%'
      ORDER BY first_name
      LIMIT 1
    `);

    let doctorId, doctorName;
    if (doctorResult.rows.length > 0) {
      doctorId = doctorResult.rows[0].id;
      doctorName = `Dr. ${doctorResult.rows[0].first_name} ${doctorResult.rows[0].last_name}`;
      console.log(`✅ Using doctor: ${doctorName}`);
    } else {
      console.log('⚠️  No doctors found in database. Creating mock doctor...');
      const mockDoctorResult = await query(`
        INSERT INTO staff (id, first_name, last_name, email, role, specialization, status)
        VALUES (uuid_generate_v4(), 'Test', 'Doctor', 'test.doctor@hms.com', 'DOCTOR', 'General Medicine', 'ACTIVE')
        RETURNING id, first_name, last_name
      `);
      doctorId = mockDoctorResult.rows[0].id;
      doctorName = `Dr. ${mockDoctorResult.rows[0].first_name} ${mockDoctorResult.rows[0].last_name}`;
      console.log(`✅ Created doctor: ${doctorName}`);
    }

    console.log('\n═'.repeat(80));
    console.log('📝 Step 3: Creating Test Data...\n');

    // Step 4: Create Medical Record
    console.log('1️⃣  Creating Medical Record...');
    const medicalRecordResult = await query(`
      INSERT INTO medical_records (
        id, patient_id, patient_name, doctor_id, doctor_name,
        title, diagnosis, treatment, notes, date
      )
      VALUES (
        uuid_generate_v4(),
        $1,
        $2,
        $3,
        $4,
        'Annual Checkup - ${new Date().toLocaleDateString()}',
        'Patient is in good health. Blood pressure and vital signs normal.',
        'Continue regular exercise and balanced diet. Follow-up in 6 months.',
        'Patient reports no major health concerns. All tests came back normal.',
        NOW()
      )
      RETURNING id, title
    `, [
      selectedPatient.id,
      `${selectedPatient.first_name} ${selectedPatient.last_name}`,
      doctorId,
      doctorName
    ]);
    console.log(`   ✅ Medical Record Created: ${medicalRecordResult.rows[0].title}`);

    // Step 5: Create Prescriptions
    console.log('\n2️⃣  Creating Prescriptions...');
    const prescriptions = [
      {
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        status: 'ACTIVE',
        refills: 0
      },
      {
        medication: 'Vitamin D3',
        dosage: '1000 IU',
        frequency: 'Once daily',
        duration: '30 days',
        status: 'ACTIVE',
        refills: 2
      }
    ];

    for (const rx of prescriptions) {
      await query(`
        INSERT INTO prescriptions (
          id, patient_id, patient_name, medication_name,
          dosage, frequency, duration, prescribed_by, prescribed_date,
          status, refills_remaining, notes
        )
        VALUES (
          uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8, $9,
          'Take with food. Complete full course.'
        )
      `, [
        selectedPatient.id,
        `${selectedPatient.first_name} ${selectedPatient.last_name}`,
        rx.medication,
        rx.dosage,
        rx.frequency,
        rx.duration,
        doctorName,
        rx.status,
        rx.refills
      ]);
      console.log(`   ✅ Prescription: ${rx.medication} ${rx.dosage}`);
    }

    // Step 6: Create Lab Tests
    console.log('\n3️⃣  Creating Lab Tests...');
    const labTests = [
      {
        test_name: 'Complete Blood Count (CBC)',
        test_type: 'BLOOD',
        status: 'COMPLETED',
        results: 'WBC: 7.2 K/uL, RBC: 4.8 M/uL, Hemoglobin: 14.5 g/dL - All values within normal range'
      },
      {
        test_name: 'Lipid Panel',
        test_type: 'BLOOD',
        status: 'ORDERED',
        results: null
      }
    ];

    for (const test of labTests) {
      await query(`
        INSERT INTO lab_tests (
          id, patient_id, patient_name, ordered_by,
          test_name, test_type, status, results, ordered_date
        )
        VALUES (
          uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, CURRENT_DATE
        )
      `, [
        selectedPatient.id,
        `${selectedPatient.first_name} ${selectedPatient.last_name}`,
        doctorName,
        test.test_name,
        test.test_type,
        test.status,
        test.results
      ]);
      console.log(`   ✅ Lab Test: ${test.test_name} (${test.status})`);
    }

    // Step 7: Create Invoice
    console.log('\n4️⃣  Creating Invoice...');
    await query(`
      INSERT INTO invoices (
        id, patient_id, patient_name, subtotal, tax, total, status, due_date, date
      )
      VALUES (
        uuid_generate_v4(), $1, $2, 130.00, 20.00, 150.00, 'PENDING', 
        CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE
      )
    `, [
      selectedPatient.id,
      `${selectedPatient.first_name} ${selectedPatient.last_name}`
    ]);
    console.log('   ✅ Invoice Created: $150.00 (PENDING)');

    // Step 8: Verification
    console.log('\n═'.repeat(80));
    console.log('🔍 Step 4: Verification\n');

    const verifyResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM medical_records WHERE patient_id = $1) as medical_records,
        (SELECT COUNT(*) FROM prescriptions WHERE patient_id = $1) as prescriptions,
        (SELECT COUNT(*) FROM lab_tests WHERE patient_id = $1) as lab_tests,
        (SELECT COUNT(*) FROM invoices WHERE patient_id = $1) as invoices
    `, [selectedPatient.id]);

    const counts = verifyResult.rows[0];
    console.log(`✅ Medical Records: ${counts.medical_records}`);
    console.log(`✅ Prescriptions: ${counts.prescriptions}`);
    console.log(`✅ Lab Tests: ${counts.lab_tests}`);
    console.log(`✅ Invoices: ${counts.invoices}`);

    console.log('\n═'.repeat(80));
    console.log('🎉 SUCCESS! Test data created successfully!\n');
    console.log('📱 Next Steps:');
    console.log(`   1. Login as: ${selectedPatient.email}`);
    console.log(`   2. Check your dashboard to see all the data`);
    console.log(`   3. Navigate to Medical Records, Prescriptions, Lab Results, and Billing\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

setupTestData();
