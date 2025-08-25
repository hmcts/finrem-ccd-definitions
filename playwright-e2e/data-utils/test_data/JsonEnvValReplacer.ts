import {envTestData} from "./EnvTestDataConfig.ts";
import fs from "fs";

export function updateJsonFileWithEnvValues(
  jsonStr: string
): Record<string, any> {
  // Replace placeholders in the JSON string with environment test data values
  for (const [placeholder, value] of Object.entries(envTestData)) {
    jsonStr = jsonStr.replace(new RegExp(placeholder, 'g'), value);
  }
  return JSON.parse(jsonStr);
}
