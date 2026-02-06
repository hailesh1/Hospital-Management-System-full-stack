const fs = require('fs');
const path = require('path');

function findFile(dir, filename) {
    let files = [];
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return null;
    }

    for (const file of files) {
        const fullPath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) { continue; }

        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === '.next') continue;
            const result = findFile(fullPath, filename);
            if (result) return result;
        } else if (file === filename) {
            return fullPath;
        }
    }
    return null;
}

const result = findFile('c:\\Projects', 'add-patient-dialog.tsx');
if (result) {
    fs.writeFileSync('c:\\Projects\\found_file.txt', result);
    console.log('Found:', result);
} else {
    console.log('Not found');
}
