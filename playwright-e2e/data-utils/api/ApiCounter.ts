import * as fs from "fs";
import * as path from "path";

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
  static async incrementIdamApiCall() {
    ApiCounter.idamApiCall++;
  }

  static async incrementIdamCodeApiCall() {
    ApiCounter.idamCodeApiCall++;
  }

  static async incrementServiceTokenCall() {
    ApiCounter.serviceTokenCall++;
  }

  static async incrementUserIdCall() {
    ApiCounter.userIdCall++;
  }

  static async incrementCcdApiCall() {
    ApiCounter.ccdApiCall++;
  }

  static async saveResult() {
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

export function saveApiCountsToCsv(testName: string) {
  console.log("Saving API counts to CSV for test: " + testName);
  //ApiCounter.saveResult();
const filePath = path.resolve(__dirname, "../../api-call-counts.csv");
  ApiCounter.totalApiCalls = ApiCounter.idamApiCall + ApiCounter.idamCodeApiCall + ApiCounter.serviceTokenCall + ApiCounter.userIdCall + ApiCounter.ccdApiCall;
  const line = `${testName},${ApiCounter.idamApiCall},${ApiCounter.idamCodeApiCall},${ApiCounter.serviceTokenCall},${ApiCounter.userIdCall},${ApiCounter.ccdApiCall},${ApiCounter.totalApiCalls}\n`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "Test Name,IDAM API Calls,IDAM Code API Calls,Service Token Calls,User ID Calls,CCD API calls,Total API Calls\n");
  }
  fs.appendFileSync(filePath, line);
  ApiCounter.resetCounters();
}