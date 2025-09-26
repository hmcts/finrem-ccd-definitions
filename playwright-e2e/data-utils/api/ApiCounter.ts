import fs from 'fs-extra';
import lockfile from 'proper-lockfile';
import * as path from "path";

type ApiCallCounts = {
  idamApiCall: number;
  idamCodeApiCall: number;
  serviceTokenCall: number;
  userIdCall: number;
  ccdApiCall: number;
  totalApiCalls: number;
}

export class ApiCounter {

  static idamApiCall = 0;
  static idamCodeApiCall = 0;
  static serviceTokenCall = 0;
  static userIdCall = 0;
  static ccdApiCall = 0;
  static totalApiCalls = 0;

  static resetCounters() {
    ApiCounter.idamApiCall = 0;
    ApiCounter.idamCodeApiCall = 0;
    ApiCounter.serviceTokenCall = 0;
    ApiCounter.userIdCall = 0;
    ApiCounter.ccdApiCall = 0;
    ApiCounter.totalApiCalls = 0;
  }
  static incrementIdamApiCall() {
    ApiCounter.idamApiCall++;
  }

  static incrementIdamCodeApiCall() {
    ApiCounter.idamCodeApiCall++;
  }

  static incrementServiceTokenCall() {
    ApiCounter.serviceTokenCall++;
  }

  static incrementUserIdCall() {
    ApiCounter.userIdCall++;
  }

  static incrementCcdApiCall() {
    ApiCounter.ccdApiCall++;
  }

  static saveResult() {
    const workerId = process.env.TEST_WORKER_INDEX ?? "unknown";
    console.log(`********* API CALL COUNTS (Worker: ${workerId}) *********`);
    console.log(`IDAM API Calls: ${ApiCounter.idamApiCall}`);
    console.log(`IDAM Code API Calls: ${ApiCounter.idamCodeApiCall}`);
    console.log(`Service Token Calls: ${ApiCounter.serviceTokenCall}`);
    console.log(`User ID Calls: ${ApiCounter.userIdCall}`);
    console.log(`CCD API Calls: ${ApiCounter.ccdApiCall}`);
    ApiCounter.totalApiCalls = ApiCounter.idamApiCall + ApiCounter.idamCodeApiCall + ApiCounter.serviceTokenCall + ApiCounter.userIdCall + ApiCounter.ccdApiCall;
    console.log(`Total API Calls: ${ApiCounter.totalApiCalls}`);
    console.log("***********************************************");
  }

}

export async function saveApiCountsToCsv(workerName: string) {
  console.log("Saving API counts to CSV for worker: " + workerName);
  ApiCounter.saveResult();
  const filename = `api-call-counts.csv`;
  const filePath = path.resolve(__dirname, "../../" + filename);
  console.log(` resolved file path: ${filePath}`);
  ApiCounter.totalApiCalls = ApiCounter.idamApiCall + ApiCounter.idamCodeApiCall + ApiCounter.serviceTokenCall + ApiCounter.userIdCall + ApiCounter.ccdApiCall;

  let release: (() => Promise<void>) | undefined;
  try{
    release = await lockfile.lock(filePath, { retries: 5, realpath: false});
    const exists = await fs.pathExists(filePath);
    const line = `${workerName},${ApiCounter.idamApiCall},${ApiCounter.idamCodeApiCall},${ApiCounter.serviceTokenCall},${ApiCounter.userIdCall},${ApiCounter.ccdApiCall},${ApiCounter.totalApiCalls}\n`;
    if (!exists) {
      await fs.writeFile(filePath, "Test Name,IDAM API Calls,IDAM Code API Calls,Service Token Calls,User ID Calls,CCD API calls,Total API Calls\n");
    }
    await fs.appendFile(filePath, line);
  } catch (err) {
    console.error("Error acquiring file lock for API counts CSV: ", err);
  } finally {
    if (release) {
      await release().catch(
       err => console.error("Error releasing file lock for API counts CSV: ", err)
      );
    }
  }
  ApiCounter.resetCounters();
}


export async function saveApiCountsToJson() {
  const filename = `api-call-counts.json`;
  console.log("Saving API counts to JSON for worker: " + process.env.TEST_WORKER_INDEX);
  const filePath = path.resolve(__dirname, "../../" + filename);

  let release: (() => Promise<void>) | undefined;
  try {
    release = await lockfile.lock(filePath, { retries: 5, realpath: false });
    let prev = {
      idamApiCall: 0,
      idamCodeApiCall: 0,
      serviceTokenCall: 0,
      userIdCall: 0,
      ccdApiCall: 0,
      totalApiCalls: 0
    };
    if (await fs.pathExists(filePath)) {
      prev = await fs.readJson(filePath);
    }
    const current = {
      idamApiCall: prev.idamApiCall + ApiCounter.idamApiCall,
      idamCodeApiCall: prev.idamCodeApiCall + ApiCounter.idamCodeApiCall,
      serviceTokenCall: prev.serviceTokenCall + ApiCounter.serviceTokenCall,
      userIdCall: prev.userIdCall + ApiCounter.userIdCall,
      ccdApiCall: prev.ccdApiCall + ApiCounter.ccdApiCall,
      totalApiCalls: prev.totalApiCalls + (
        ApiCounter.idamApiCall +
        ApiCounter.idamCodeApiCall +
        ApiCounter.serviceTokenCall +
        ApiCounter.userIdCall +
        ApiCounter.ccdApiCall
      )
    };
    await fs.writeJson(filePath, current, { spaces: 2 });
  } catch (err) {
    console.error("Error handling file lock for API counts JSON: ", err);
  } finally {
    if (release) {
      await release().catch(
        err => console.error("Error releasing file lock for API counts JSON: ", err)
      );
    }
  }
  ApiCounter.resetCounters();
}