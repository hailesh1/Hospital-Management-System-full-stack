try {
  const patient_id = 123;
  if (patient_id === 'P-0001' || (patient_id && !patient_id.includes('-'))) {
    console.log('It works');
  }
} catch (error) {
  console.log('Caught expected error:', error.message);
}
