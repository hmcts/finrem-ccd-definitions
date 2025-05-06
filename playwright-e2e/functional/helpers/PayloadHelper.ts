import fs from 'fs';
import { updateCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';
import { updateCaseInCcdFromJSON, makeModifications } from '../../../test/helpers/utils';

export class PayloadHelper {

  private static async updateCaseWorkerSteps(caseId: string, steps: { event: string, payload?: string }[]): Promise<void> {
    for (const step of steps) {
      await updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        'FinancialRemedyContested',
        step.event,
        step.payload || '' // Provide a default empty string if payload is undefined
      );
    }
  }

  static async solicitorSubmitFormACase(caseId : string) {
    await updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      'FinancialRemedyContested',
      'FR_applicationPaymentSubmission',
      './playwright-e2e/data/payload/contested/solicitor/case-submission.json'
    );
  }

  static async caseWorkerSubmitPaperCase(caseId : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' },
      { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
      { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
    ]);
  }

  static async caseWorkerProgressToListing(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_progressToSchedulingAndListing', payload: './playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json' }
    ]);
  }

  static async caseWorkerProgressPaperCaseToListing(caseId: string) {
    await this.caseWorkerSubmitPaperCase(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_progressToSchedulingAndListing', payload: './playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json' }
    ]);
  }

  static async caseworkerAllocateToJudge(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_allocateToJudge' }
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
  static caseWorkerProgressToCreateGeneralApplication(caseId: string): Promise<string> {
    return (async () => {
      const response = await updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        'FinancialRemedyContested',
        'createGeneralApplication',
        './playwright-e2e/data/payload/contested/caseworker/create-general-application/sender-is-applicant.json'
      );

      return response.case_data.appRespGeneralApplications[0].id;
    })();
  }

  /**
   * Progresses a case to the "Refer to Judge (Application)" state for a general application.
   * Modifies a JSON payload with the dynamically generated general application ID
   * and submits it via CCD API.
   *
   * @param caseId - The CCD case ID to update
   * @returns A Promise that resolves to the general application ID (string)
   */
  static caseworkerProgressToGeneralApplicationReferToJudge(caseId: string): Promise<string> {
    return (async () => {
      const generalApplicationId = await this.caseWorkerProgressToCreateGeneralApplication(caseId);

      const referListDataModifications = [
        { action: 'insert', key: 'generalApplicationReferList.value.code', value: generalApplicationId },
        { action: 'insert', key: 'generalApplicationReferList.list_items[0].code', value: generalApplicationId }
      ];

      const referToJudgeJsonObject = await this.createUpdatedJsonObjectFromFile(
        './playwright-e2e/data/payload/contested/caseworker/refer-to-judge/judge-email-is-null.json',
        referListDataModifications
      );

      await updateCaseInCcdFromJSON(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        'FinancialRemedyContested',
        'FR_generalApplicationReferToJudge',
        referToJudgeJsonObject
      );

      return generalApplicationId;
    })();
  }

  /**
   * Progresses a case to the "General Application Outcome" state.
   * Modifies a JSON payload with the dynamically generated general application ID
   * and submits it via CCD API.
   *
   * @param caseId - The CCD case ID to update
   */
  static async caseWorkerProgressToGeneralApplicationOutcome(caseId: string) {
    const generalApplicationId = await this.caseworkerProgressToGeneralApplicationReferToJudge(caseId);

    // Create a modification object to update the JSON file with the new general application ID
    const outcomeListDataModifications = [
      { action: 'insert', key: 'generalApplicationOutcomeList.value.code', value: generalApplicationId },
      { action: 'insert', key: 'generalApplicationOutcomeList.list_items[0].code', value: generalApplicationId }
    ];

    // Load the JSON file and modify it to consider the new general application ID
    const generalOutcomeJsonObject = await this.createUpdatedJsonObjectFromFile(
      './playwright-e2e/data/payload/contested/caseworker/general-application-outcome/outcome-is-other.json',
      outcomeListDataModifications
    );

    // Run the FR_generalApplicationReferToJudge with the modified JSON object using the new general application ID
    await updateCaseInCcdFromJSON(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_GeneralApplicationOutcome',
      generalOutcomeJsonObject
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
    await makeModifications(dataModifications, json);
    return json;
  }
}
