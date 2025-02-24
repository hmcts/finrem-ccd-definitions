const fs = require('fs');

// Define the input and output files
const inputFile = 'build/extracted.json';
const outputFile = 'build/sorted.json';

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the input file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    let newApplication = jsonData.find(item => item.ListElement === 'New Application');
    jsonData = jsonData.filter(item => item.ListElement !== 'New Application');

    // Sort the data by the ListElement value
    jsonData.sort((a, b) => a.ListElement.localeCompare(b.ListElement));

    jsonData.unshift(newApplication);

    // Add the DisplayOrder field with a sequence number
    jsonData.forEach((item, index) => {
        item.DisplayOrder = index + 1;
    });

    // Write the updated data to the output file
    fs.writeFile(outputFile, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing the output file:', err);
            return;
        }
        console.log('Data has been updated in', outputFile);
    });
});
