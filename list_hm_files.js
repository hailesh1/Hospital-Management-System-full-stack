const fs = require('fs');
const path = require('path');
const targetDir = 'c:\\Projects\\HospitalManagement';

try {
  const files = fs.readdirSync(targetDir, { withFileTypes: true });
  const result = files.map(d => d.name);
  fs.writeFileSync('c:\\Projects\\hm_files.json', JSON.stringify(result));
} catch (e) {
  fs.writeFileSync('c:\\Projects\\hm_error.txt', e.message);
}
