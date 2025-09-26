import fs from 'fs-extra';
import * as path from 'path';

export default async function globalTeardown() {
  const filePath = path.resolve(__dirname, './api-call-counts.json');
  if (await fs.pathExists(filePath)) {
    const data = await fs.readJson(filePath);
    console.log('********* FINAL API CALL COUNTS *********');
    console.log(JSON.stringify(data, null, 2));
    console.log('*****************************************');
    await fs.remove(filePath);
  } else {
    console.log('No API call counts file found.');
  }
}
