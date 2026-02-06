const fs = require('fs');
fs.readdir('.', { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    const dirs = files.filter(d => d.isDirectory()).map(d => d.name);
    fs.writeFileSync('dirs.json', JSON.stringify(dirs));
  }
});