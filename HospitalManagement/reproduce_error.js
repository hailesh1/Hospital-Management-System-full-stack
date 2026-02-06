
const { query } = require('./frontend/lib/db');

async function reproduce() {
  try {
    // Attempt a minimal insert mimicking the POST handler
    const text = `
      INSERT INTO medical_records (id, patient_id, patient_name, title, type, file_name, notes, created_at, doctor_id, doctor_name)
      VALUES (uuid_generate_v4(), 'test-pat', 'Test Pat', 'Test Title', 'Test Type', 'test.pdf', 'Test Notes', NOW(), 'test-doc', 'Test Doc')
    `;
    await query(text);
    console.log('Insert successful');
  } catch (err) {
    console.error('Insert failed:', err.message);
  }
}

reproduce();
