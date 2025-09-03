import { readFileSync } from "fs";
import path from "path";
import { set, unset } from "lodash";
import { ReplacementAction } from "../../types/replacement-action";
import {axiosRequest} from "./ApiHelper.ts";
import {getServiceToken, getUserId, getUserToken} from "./TokenHelperApi.ts";
import {AxiosResponse} from "axios";
import {updateJsonFileWithEnvValues} from "../test_data/JsonEnvValReplacer.ts";
import config from "../../config/config.ts";

const ccdApiUrl = config.ccdDataStoreApi;

export class CcdApi {

  async getStartEventToken(
      ccdStartCasePath: string,
      ccdSaveCasePath: string,
      authToken: string,
      serviceToken: string
  ): Promise<string> {
    const startCaseResponse = await axiosRequest({
      method: "get",
      url: ccdApiUrl + ccdStartCasePath,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceToken}`,
        "Content-Type": "application/json",
      },
    });

    return startCaseResponse.data.token;
  }

  async saveCase(
      ccdSaveCasePath: string,
      authToken: string,
      serviceToken: string,
      payload: any
  ): Promise<AxiosResponse> {

    return await axiosRequest({
      url: ccdApiUrl + ccdSaveCasePath,
      method: "post",
      data: payload,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  async createCaseInCcd(
      userName: string,
      password: string,
      dataLocation: string,
      caseType: string,
      eventId: string,
      dataModifications: ReplacementAction[] = []
  ): Promise<string> {
    if (!process.env.CI) {
      console.info("Creating CCD case with event %s...", eventId);
    }
    const authToken = await getUserToken(userName, password);
    const userId = await getUserId(authToken);
    const serviceToken = await getServiceToken();

    const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/event-triggers/${eventId}/token`;
    const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases`;

    const eventToken = await this.getStartEventToken(
        ccdStartCasePath,
        ccdSaveCasePath,
        authToken,
        serviceToken
    );

    const rawData = readFileSync(path.resolve(dataLocation), "utf-8");
    const data = updateJsonFileWithEnvValues(rawData);

    dataModifications.forEach((mod) => {
      if (mod.action === "delete") {
        delete data[mod.key];
      } else if (mod.action === "insert") {
        data[mod.key] = mod.value;
      }
    });

    const payload = {
      data,
      event: {
        id: eventId,
        summary: "Creating Basic Case",
        description: "For CCD E2E Test",
      },
      event_token: eventToken,
    };

    const saveCaseResponse = await this.saveCase(
        ccdSaveCasePath,
        authToken,
        serviceToken,
        payload
    );
    const caseId = saveCaseResponse.data.id;
    console.info("Created case with id %s for event %s", caseId, eventId);

    return caseId;
  }

  async updateCaseInCcd(
      userName: string,
      password: string,
      caseId: string,
      caseType: string,
      eventId: string,
      dataLocation: string,
      replacements: ReplacementAction[] = []
  ): Promise<any> {
    if (!process.env.CI) {
      console.info("Updating CCD case id %s with event %s...", caseId, eventId);
    }

    const authToken = await getUserToken(userName, password);
    const userId = await getUserId(authToken);
    const serviceToken = await getServiceToken();

    const ccdStartEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/event-triggers/${eventId}/token`;
    const ccdSaveEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/events`;

    const eventToken = await this.getStartEventToken(
        ccdStartEventPath,
        ccdSaveEventPath,
        authToken,
        serviceToken
    );

    const rawData = dataLocation
        ? readFileSync(path.resolve(dataLocation), "utf-8")
        : "{}";

    let updatedDataObj = updateJsonFileWithEnvValues(rawData);

    // Apply the key-based mutations
    for (const action of replacements) {
      if (action.action === "insert") {
        updatedDataObj[action.key] = action.value;
      } else if (action.action === "delete") {
        delete updatedDataObj[action.key];
      }
    }

    const payload = {
      data: updatedDataObj,
      event: {
        id: eventId,
        summary: "Updating Case",
        description: "For CCD E2E Test",
      },
      event_token: eventToken,
    };
     console.log(payload);
    const saveCaseResponse = await this.saveCase(
        ccdSaveEventPath,
        authToken,
        serviceToken,
        payload
    );
    if (!process.env.CI) {
      console.info("Updated case with id %s and event %s", caseId, eventId);
    }
    return saveCaseResponse?.data;
  }

  /**
   * Updates a case in CCD using a JSON object.
   *
   * @param userName - The username for authentication.
   * @param password - The password for authentication.
   * @param caseId - The CCD case ID to update.
   * @param caseType - The case type (e.g., "FinancialRemedyContested").
   * @param eventId - The event ID to trigger the update.
   * @param jsonObject - The JSON object containing the updated data.
   * @param shareCaseRef - Optional reference for shared cases.
   * @returns The response data from the CCD API.
   */
  async updateCaseInCcdFromJSONObject(
      userName: string,
      password: string,
      caseId: string,
      caseType: string,
      eventId: string,
      jsonObject: any,
      shareCaseRef?: string
  ): Promise<any> {
    if (!process.env.CI) {
      console.info("Updating CCD case id %s with event %s (from JSON object)...", caseId, eventId);
    }

    const authToken = await getUserToken(userName, password);
    const userId = await getUserId(authToken);
    const serviceToken = await getServiceToken();

    const ccdStartEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/event-triggers/${eventId}/token`;
    const ccdSaveEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/events`;

    const eventToken = await this.getStartEventToken(
        ccdStartEventPath,
        ccdSaveEventPath,
        authToken,
        serviceToken
    );

    let updatedData = JSON.stringify(jsonObject);
    updatedData = JSON.stringify(updateJsonFileWithEnvValues(updatedData));

    if (shareCaseRef) {
      updatedData = updatedData.replace("ReplaceForShareCase", shareCaseRef);
    }

    const payload = {
      data: JSON.parse(updatedData),
      event: {
        id: `${eventId}`,
        summary: "Updating Case",
        description: "For CCD E2E Test",
      },
      event_token: eventToken,
    };

    const saveCaseResponse = await this.saveCase(
        ccdSaveEventPath,
        authToken,
        serviceToken,
        payload
    );
    if (!process.env.CI) {
      console.info("Updated case with id %s and event %s", caseId, eventId);
    }
    return saveCaseResponse.data;
  }

  /**
   * Applies modifications to a JSON object based on the provided actions.
   *
   * @param dataModifications - An array of actions to modify the JSON object.
   * @param data - The JSON object to modify.
   */
  makeModifications(dataModifications: { action: string, key: string, value?: any }[], data: any): void {
    if (Array.isArray(dataModifications)) {
      dataModifications.forEach((modification) => {
        const { action, key, value } = modification;
        if (!key) return;

        if (action === "delete") {
          unset(data, key);
        } else if (action === "insert") {
          set(data, key, value);
        }
      });
    }
  }
}
