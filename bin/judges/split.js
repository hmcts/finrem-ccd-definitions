const fs = require('fs');
const path = require('path');

const inputFile = 'build/sorted.json';
const outputDir = 'build/output';

// Ensure the output directory exists
if (fs.existsSync(outputDir)) {
    fs.readdirSync(outputDir).forEach(f => fs.rmSync(`${outputDir}/${f}`));
} else {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the input file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData;
    try {
        jsonData = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing JSON data:', parseErr);
        return;
    }

    // Split the data into chunks of 115 elements each
    const chunkSize = 115;
    for (let i = 0; i < jsonData.length; i += chunkSize) {
        const chunk = jsonData.slice(i, i + chunkSize);
        const outputFileName = path.join(outputDir, `judgedetails-${Math.floor(i / chunkSize) + 1}.json`);

        // Write each chunk to a separate file
        fs.writeFile(outputFileName, JSON.stringify(chunk, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing the output file:', err);
                return;
            }
            console.log(`Data has been written to ${outputFileName}`);
        });
    }
});
