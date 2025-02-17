const xlsx = require('xlsx');
const fs = require('fs');

const inputFile = 'build/ccd-config.xlsx';
const outputFile = 'build/extracted.json';

// Read the spreadsheet
const workbook = xlsx.readFile(inputFile);
const sheetName = 'FixedLists';
const worksheet = workbook.Sheets[sheetName];

// Convert the sheet to JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

// Function to convert Excel date to string format dd/MM/yyyy
function excelDateToJSDate(excelDate) {
    const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Filter and process the data
const filteredData = jsonData
    .filter(row => row[2] === 'FR_fl_AssignToJudge')
    .map(row => ({
        LiveFrom: excelDateToJSDate(row[0]),
        ID: row[2],
        ListElementCode: row[3],
        ListElement: row[4]
    }));

// Write the data to a JSON file
fs.writeFile(outputFile, JSON.stringify(filteredData, null, 2), 'utf8', (err) => {
    if (err) {
        console.error('Error writing the output file:', err);
        return;
    }
    console.log('Data has been written to', outputFile);
});
