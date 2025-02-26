const XLSX = require('sheetjs-style');
const fs = require('fs');
const path = require('path');

// Load the spreadsheet
const workbook = XLSX.readFile('build/updates.xlsx');

// Select the sheet named 'To be Added'
const sheetNameToAdd = 'To be Added';
const worksheetToAdd = workbook.Sheets[sheetNameToAdd];

// Convert the sheet to JSON
const dataToAdd = XLSX.utils.sheet_to_json(worksheetToAdd, { header: 1 }).filter(row => row[0] && row[1]);

// Map each row to the desired JSON format
const jsonArrayToAdd = dataToAdd.slice(1).map(row => ({
  LiveFrom: "01/01/2017",
  ID: "FR_fl_AssignToJudge",
  ListElementCode: row[0].trim(),
  ListElement: row[1].trim()
}));

// Select the sheet named 'To be Updated'
const sheetNameToUpdate = 'To be Updated';
const worksheetToUpdate = workbook.Sheets[sheetNameToUpdate];

// Convert the sheet to JSON
const dataToUpdate = XLSX.utils.sheet_to_json(worksheetToUpdate, { header: 1 });

// Read the existing data from extracted.json
const extractedFilePath = path.join(__dirname, 'build', 'extracted.json');
let existingData = [];

if (fs.existsSync(extractedFilePath)) {
  const fileContent = fs.readFileSync(extractedFilePath, 'utf8');
  existingData = JSON.parse(fileContent);
}

// Update existing data based on 'To be Updated' sheet
dataToUpdate.slice(1).forEach(row => {
  const listElementToUpdate = row[1];
  const newListElement = row[2];
  if (!listElementToUpdate || !newListElement) {
    return;
  }

  let matchFound = false;
  existingData.forEach(item => {
    if (item.ListElement.trim() === listElementToUpdate.trim()) {
      item.ListElement = newListElement.trim();
      matchFound = true;
    }
  });
  if (!matchFound) {
    console.error(`No match found to update ListElement: ${listElementToUpdate.trim()}`);
    console.error('Import aborted');
    process.exit(1);
  }
});

// Append the new data to the existing data
const updatedData = existingData.concat(jsonArrayToAdd);

// Write the updated data back to extracted.json
fs.writeFileSync(extractedFilePath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log('Data has been added to extracted.json');
console.log('Please run node validate to validate the changes');
