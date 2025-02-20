const fs = require('fs');
const path = require('path');

const backupDir = 'build/backup';
const combinedFile = 'build/current-prod.json';
const otherFile = 'build/extracted.json';

// Read the other file
const combinedData = JSON.parse(fs.readFileSync(combinedFile, 'utf8'));
const otherData = JSON.parse(fs.readFileSync(otherFile, 'utf8'));

// Check for duplicate ListElementCode values
const listElementCodes = otherData.map(item => item.ListElementCode);
const duplicates = listElementCodes.filter((item, index) => listElementCodes.indexOf(item) !== index);

if (duplicates.length > 0) {
    console.error('Duplicate ListElementCode values found:');
    console.error(JSON.stringify(duplicates, null, 2));
    process.exit(1);
} else {
    console.log('No duplicate ListElementCode values found');
}

// Compare the combined data with the other data
const additions = otherData
    .filter(item => {
        const otherItem = combinedData.find(other => other.ListElementCode === item.ListElementCode);
        return !otherItem;
    })
    .map(item => `${item.ListElement} ${item.ListElementCode}`);

if (additions.length > 0) {
    console.log('Additions found: ' + additions.length);
    console.log(JSON.stringify(additions, null, 2));
} else {
    console.log('No additions found');
}

const changes = otherData
    .filter(item => {
        const otherItem = combinedData.find(other => other.ListElementCode === item.ListElementCode);
        return otherItem && otherItem.ListElement !== item.ListElement;
    })
    .map(item => `${item.ListElement} ${item.ListElementCode}`);

if (changes.length > 0) {
    console.log('Changes found: ' + changes.length);
    console.log(JSON.stringify(changes, null, 2));
} else {
    console.log('No changes found');
}
