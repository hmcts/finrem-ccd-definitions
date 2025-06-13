import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { readFileSync } from "fs";
import path from "path";
import { authenticator } from "otplib";
import { set, unset } from "lodash";
import { ReplacementAction } from "../../types/replacement-action";

const axiosClient = axios.create({});

const env = process.env.RUNNING_ENV || "aat";
const ccdApiUrl = process.env.CCD_DATA_API_URL;
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;

export class CcdApi {
  async axiosRequest<T = any>(
      requestParams: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      const response = await axiosClient(requestParams);
      if (![200, 201].includes(response.status)) {
        throw new Error(`Request to ${requestParams.url} failed with status ${response.status}. Response data: ${JSON.stringify(response.data)}`);
      }
      return response;
    } catch (error: any) {
      const serverMessage = error.response?.data
          ? ` \nServer response: ${JSON.stringify(error.response.data)}`
          : "";
      throw new Error(
          `Request to ${requestParams.url} failed: ${error.message}${serverMessage}`
      );
    }
  }

  async getUserToken(username: string, password: string): Promise<string> {
    const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
    const redirectUri = `https://div-pfe-${env}.service.core-compute-${env}.internal/authenticated`;
    const idamCodePath = `/oauth2/authorize?response_type=code&client_id=divorce&redirect_uri=${redirectUri}`;

    const idamCodeResponse = await this.axiosRequest({
      method: "post",
      url: idamBaseUrl + idamCodePath,
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const idamAuthPath = `/oauth2/token?grant_type=authorization_code&client_id=divorce&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&code=${idamCodeResponse.data.code}`;

    const authTokenResponse = await this.axiosRequest({
      method: "post",
      url: idamBaseUrl + idamAuthPath,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return authTokenResponse.data.access_token;
  }

  async getUserId(authToken: string): Promise<string> {
    const idamDetailsPath = "/details";

    const userDetailsResponse = await this.axiosRequest({
      method: "get",
      url: idamBaseUrl + idamDetailsPath,
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return userDetailsResponse.data.id;
  }

  async getServiceToken(): Promise<string> {
    const serviceSecret = process.env.FINREM_CASE_ORCHESTRATION_SERVICE_S2S_KEY || "";
    const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
    const s2sAuthPath = "/lease";

    const oneTimePassword = authenticator.generate(serviceSecret);

    const serviceTokenResponse = await this.axiosRequest({
      url: s2sBaseUrl + s2sAuthPath,
      method: "post",
      data: {
        microservice: "finrem_case_orchestration",
        oneTimePassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return serviceTokenResponse.data;
  }

  async getStartEventToken(
      ccdStartCasePath: string,
      ccdSaveCasePath: string,
      authToken: string,
      serviceToken: string
  ): Promise<string> {
    const startCaseResponse = await this.axiosRequest({
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

    return await this.axiosRequest({
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
    const authToken = await this.getUserToken(userName, password);
    const userId = await this.getUserId(authToken);
    const serviceToken = await this.getServiceToken();

    const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/event-triggers/${eventId}/token`;
    const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases`;

    const eventToken = await this.getStartEventToken(
        ccdStartCasePath,
        ccdSaveCasePath,
        authToken,
        serviceToken
    );

    const rawData = readFileSync(path.resolve(dataLocation), "utf-8");
    const data = JSON.parse(rawData);

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

    const authToken = await this.getUserToken(userName, password);
    const userId = await this.getUserId(authToken);
    const serviceToken = await this.getServiceToken();

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

    let updatedDataObj = JSON.parse(rawData);

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

    const authToken = await this.getUserToken(userName, password);
    const userId = await this.getUserId(authToken);
    const serviceToken = await this.getServiceToken();

    const ccdStartEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/event-triggers/${eventId}/token`;
    const ccdSaveEventPath = `/caseworkers/${userId}/jurisdictions/DIVORCE/case-types/${caseType}/cases/${caseId}/events`;

    const eventToken = await this.getStartEventToken(
        ccdStartEventPath,
        ccdSaveEventPath,
        authToken,
        serviceToken
    );

    let updatedData = JSON.stringify(jsonObject);
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
