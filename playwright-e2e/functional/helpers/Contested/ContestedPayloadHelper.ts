import fs from 'fs';
import { apiHelper } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents, CaseType, PayloadPath } from "../../../config/case-data";

export class PayloadHelper {

  private static async updateCaseWorkerSteps(caseId: string, steps: { event: string, payload?: string }[]): Promise<void> {
    for (const step of steps) {
      await apiHelper.updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        CaseType.Contested,
        step.event,
        step.payload || ''
      );
    }
  }

  static async solicitorSubmitFormACase(caseId : string) {
    await apiHelper.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Contested.formASubmit
    );
  }

  static async caseWorkerHwfDecisionMade(caseId : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.hwfDecisionMade.ccdCallback, payload: PayloadPath.Contested.hwfDecisionMade },
    ]);
  }

  static async caseWorkerManualPayment(caseId : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.manualPayment.ccdCallback, payload: PayloadPath.Contested.manualPayment },
    ]);
  }

  static async caseWorkerSubmitPaperCase(caseId : string) {
    await this.caseWorkerManualPayment(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.issueApplication.ccdCallback, payload: PayloadPath.Contested.issueApplication },
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.caseWorkerHwfDecisionMade(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.issueApplication.ccdCallback, payload: PayloadPath.Contested.issueApplication }
    ]);
  }

  static async caseWorkerProgressToListing(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.progressToListing.ccdCallback, payload: PayloadPath.Contested.progressToListing }
    ]);
  }

  static async caseWorkerProgressPaperCaseToListing(caseId: string) {
    await this.caseWorkerSubmitPaperCase(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.progressToListing.ccdCallback, payload: PayloadPath.Contested.progressToListing }
    ]);
  }

  static async caseworkerAllocateToJudge(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.allocateToJudge.ccdCallback }
    ]);
  }

  /**
   * Progresses a case to the Create General Application state.
   *
   * CCD generates a General Application ID during this process,
   * which is extracted from the response and returned as a Promise.
   *
   * @param caseId - The CCD case ID to update
   * @returns A Promise that resolves to the generated General Application ID (string)
   */
  static async caseWorkerProgressToCreateGeneralApplication(caseId: string): Promise<string> {
    const response = await apiHelper.updateCaseInCcd(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.createGeneralApplication.ccdCallback,
      PayloadPath.Contested.generalApplicationCreate
    );

    return response.case_data.appRespGeneralApplications[0].id;
  }

  /**
   * Progresses a case to the "Refer to Judge (Application)" state for a general application.
   * Modifies a JSON payload with the dynamically generated general application ID
   * and submits it via CCD API.
   *
   * @param caseId - The CCD case ID to update
   * @returns A Promise that resolves to the general application ID (string)
   */
  static async caseworkerProgressToGeneralApplicationReferToJudge(caseId: string): Promise<string> {
    const generalApplicationId = await this.caseWorkerProgressToCreateGeneralApplication(caseId);

    const referListDataModifications = [
      { action: 'insert', key: 'generalApplicationReferList.value.code', value: generalApplicationId },
      { action: 'insert', key: 'generalApplicationReferList.list_items[0].code', value: generalApplicationId }
    ];

    const referToJudgeJsonObject = await this.createUpdatedJsonObjectFromFile(
      PayloadPath.Contested.referToJudgeEmailIsNull,
      referListDataModifications
    );

    await apiHelper.updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.generalApplicationReferToJudge.ccdCallback,
      referToJudgeJsonObject
    );

    return generalApplicationId;
  }

  /**
   * Progresses a case to the "General Application Outcome" state.
   * Modifies a JSON payload with the dynamically generated general application ID
   * and submits it via CCD API.
   *
   * @param caseId - The CCD case ID to update
   */
  static async caseWorkerProgressToGeneralApplicationOutcome(caseId: string): Promise<string>{
    const generalApplicationId = await this.caseworkerProgressToGeneralApplicationReferToJudge(caseId);

    // Create a modification object to update the JSON file with the new general application ID
    const outcomeListDataModifications = [
      { action: 'insert', key: 'generalApplicationOutcomeList.value.code', value: generalApplicationId },
      { action: 'insert', key: 'generalApplicationOutcomeList.list_items[0].code', value: generalApplicationId }
    ];

    // Load the JSON file and modify it to consider the new general application ID
    const generalOutcomeJsonObject = await this.createUpdatedJsonObjectFromFile(
      PayloadPath.Contested.generalApplicationOutcomeOther,
      outcomeListDataModifications
    );

    // Run the FR_generalApplicationReferToJudge with the modified JSON object using the new general application ID
    await apiHelper.updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.generalApplicationOutcome.ccdCallback,
      generalOutcomeJsonObject
    );

    // #Other is hardcoded.  #Approved and #Not Approved are other options, if a dynamic test is needed.
    const codeForGeneralApplicationDirectionsEvent = generalApplicationId + "#Other";
    return codeForGeneralApplicationDirectionsEvent;
  }

  /**
   * Creates an old-style General Application Directions hearing for a case.
   * Progresses a case to the "General Application Directions" state.
   * Modifies a JSON payload with the dynamically generated general application ID
   * and submits it via CCD API.
   *
   * @param caseId - The CCD case ID to update
   */
  static async caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId: string) {
    const codeForGeneralApplicationDirectionsEvent = await this.caseWorkerProgressToGeneralApplicationOutcome(caseId);

    // Create a modification object to update the JSON file with the new general application ID
    const directionsListDataModifications = [
      { action: 'insert', key: 'generalApplicationDirectionsList.value.code', value: codeForGeneralApplicationDirectionsEvent },
      { action: 'insert', key: 'generalApplicationDirectionsList.list_items[0].code', value: codeForGeneralApplicationDirectionsEvent }
    ];

    // Load the JSON file and modify it to consider the new general application ID
    const generalApplicationDirectionsJsonObject = await this.createUpdatedJsonObjectFromFile(
      PayloadPath.Contested.generalApplicationOldHearingRequiredYes,
      directionsListDataModifications
    );

    // Run the FR_generalApplicationReferToJudge with the modified JSON object using the new general application ID
    await apiHelper.updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.generalApplicationDirections.ccdCallback,
      generalApplicationDirectionsJsonObject
    );
  }

  /**
   * Creates a payload object for a PDF file with a new alias name.
   * Can be passed to the setInputFiles method of a locator.
   *
   * @param filePath - The path to the original PDF file.
   * @param newFilename - The new name to assign to the PDF file in the payload.
   * @returns An object containing the new filename, pdf MIME type, and file buffer.
   */
  static async createAliasPDFPayload(filePath: string, newFilename: string) {
    const fileBuffer = fs.readFileSync(filePath);
    return {
      name: newFilename,
      mimeType: 'application/pdf',
      buffer: fileBuffer
    };
  }

  /**
    * Loads a JSON file, applies the given modifications, and returns an updated JSON object.
   *
    * @param filePath - Path to the JSON file
    * @param dataModifications - How the JSON needs changing
    * @returns Updated json as an object
    */
  static async createUpdatedJsonObjectFromFile(filePath: string, dataModifications: { action: string, key: string, value: string }[]): Promise<string> {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(fileContent);
    await apiHelper.makeModifications(dataModifications, json);
    return json;
  }
}
