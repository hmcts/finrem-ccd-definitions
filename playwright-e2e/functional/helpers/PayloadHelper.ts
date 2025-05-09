import fs from 'fs';
import { DocumentHelper } from './DocumentHelper';
import { updateCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';
import { updateCaseInCcdFromJSONObject, makeModifications } from '../../../test/helpers/utils';

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

  static async caseWorkerSubmitPaperCase(caseId : string, issueDate? : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' }
    ]);
    await this.caseWorkerIssueApplication(caseId, issueDate);
  }

  /**
   * Issues an application as a caseworker.
   * 1. Makes the HWF decision as a caseworker.
   * 2. If an `issueDate` is provided:
   *    - Modifies the issue application payload the `issueDate`, runs the `FR_issueApplication` event.
   * 3. If no `issueDate` is provided:
   *    - Runs the `FR_issueApplication` event with a static payload.
   *
   * @param caseId - The unique identifier for the case.
   * @param issueDate - Optional ISO date string (`YYYY-MM-DD`) for the issue application payload.
   */
  static async caseWorkerIssueApplication(caseId: string, issueDate?: string) {

    await this.caseWorkerHWFDecisionMade(caseId);

    if (issueDate) {
      const issueApplicationDataModifications = [
        { action: 'insert', key: 'issueDate', value: issueDate }
      ];

      const issueApplicationJsonObject = await this.createUpdatedJsonObjectFromFile(
        './playwright-e2e/data/payload/contested/caseworker/issue-application.json',
        issueApplicationDataModifications
      );

      await updateCaseInCcdFromJSONObject(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        'FinancialRemedyContested',
        'FR_issueApplication',
        issueApplicationJsonObject
      );

      } else {
      await this.updateCaseWorkerSteps(caseId, [
        { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
      ]);
    }
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' }
    ]);
  }

  static async caseWorkerProgressToListing(caseId: string, issueDate?: string) {
    await this.caseWorkerIssueApplication(caseId, issueDate);
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
  static async caseWorkerProgressToCreateGeneralApplication(caseId: string): Promise<string> {
    const response = await updateCaseInCcd(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'createGeneralApplication',
      './playwright-e2e/data/payload/contested/caseworker/create-general-application/sender-is-applicant.json'
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
      './playwright-e2e/data/payload/contested/caseworker/refer-to-judge/judge-email-is-null.json',
      referListDataModifications
    );

    await updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_generalApplicationReferToJudge',
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
      './playwright-e2e/data/payload/contested/caseworker/general-application-outcome/outcome-is-other.json',
      outcomeListDataModifications
    );

    // Run the FR_generalApplicationReferToJudge with the modified JSON object using the new general application ID
    await updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_GeneralApplicationOutcome',
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
      './playwright-e2e/data/payload/contested/caseworker/general-application-directions/old-style-hearing-required-yes.json',
      directionsListDataModifications
    );

    // Run the FR_generalApplicationReferToJudge with the modified JSON object using the new general application ID
    await updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_GeneralApplicationDirections',
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
    await makeModifications(dataModifications, json);
    return json;
  }

  /**
   * Lists a case for hearing.
   * For fast track cases, set between 6 and 10 weeks after issueDate.
   * For express cases, set between 16 and 20 weeks after issueDate.
   * For other cases, set between 12 and 16 weeks after the issueDate.
   * Callback will fail if hearingDate validation returns an error.
   * @param caseId - The CCD case ID to update
   * @param hearingDate - The date of the hearing in YYYY-MM-DD format.
   */
  static async caseworkerListForHearing(caseId: string, hearingDate : string) {

    const listForHearingDataModifications = [
      { action: 'insert', key: 'hearingDate', value: hearingDate }
    ];

    const listForHearingJsonObject = await this.createUpdatedJsonObjectFromFile(
      './playwright-e2e/data/payload/contested/caseworker/list-for-hearing/fda-example-one.json',
      listForHearingDataModifications
    );

    await updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_addSchedulingListingInfo',
      listForHearingJsonObject
    );
  }

  static async caseworkerUploadDraftOrder(caseId: string) {
    DocumentHelper.updateDraftOrderDocument(caseId);
  }

}
