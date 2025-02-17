const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, 'build', 'backup');
const combinedFile = path.join(__dirname, 'build', 'current-prod.json');
const extractedFile = path.join(__dirname, 'build', 'extracted.json');

fs.readdir(backupDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const jsonArray = [];

    files.forEach(file => {
        const filePath = path.join(backupDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        jsonArray.push(...jsonContent);
    });

    fs.writeFileSync(combinedFile, JSON.stringify(jsonArray, null, 2), 'utf8');

    const combinedContent = fs.readFileSync(combinedFile, 'utf8');
    const jsonContent = JSON.parse(combinedContent);

    const extractedArray = [];
    jsonContent.forEach(item => {
        const { DisplayOrder, ...filteredItem } = item;
        extractedArray.push(filteredItem);
    });

    fs.writeFileSync(extractedFile, JSON.stringify(extractedArray, null, 2), 'utf8');
    console.log('JSON data extracted. Now you should update build/extracted.json');
});