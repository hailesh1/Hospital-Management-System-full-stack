try {
  const body = { patient_id: 123 };
  let patient_id = body.patient_id;
  
  // The fix:
  if (patient_id) patient_id = String(patient_id);

  // Logic that previously failed:
  if (patient_id === 'P-0001' || (patient_id && !patient_id.includes('-'))) {
    console.log('Logic check passed successfully (condition true)');
  } else {
    console.log('Logic check passed successfully (condition false)');
  }
  
  console.log('Patient ID is now type:', typeof patient_id);

} catch (error) {
  console.error('Test failed with error:', error.message);
}
