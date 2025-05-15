import fs from 'fs';
import { updateCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';
import { DateHelper } from './DateHelper';
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

  static async solicitorSubmitFormACase(caseId: string) {
    await updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      'FinancialRemedyContested',
      'FR_applicationPaymentSubmission',
      './playwright-e2e/data/payload/contested/solicitor/case-submission.json'
    );
  }

  static async caseWorkerSubmitPaperCase(caseId: string, issueDate?: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' }
    ]);
    await this.caseWorkerIssueApplication(caseId, issueDate, false);
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
   * @param isFormACase - Default is true.  Required for Form A cases. Skip for Paper by passing false.
   */
  static async caseWorkerIssueApplication(caseId: string, issueDate?: string, isFormACase: boolean = true) {

    if (isFormACase) {
      await this.caseWorkerHWFDecisionMade(caseId);
    }

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

  static async caseWorkerProgressFormACaseToListing(caseId: string, issueDate?: string) {
    await this.caseWorkerIssueApplication(caseId, issueDate);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'FR_progressToSchedulingAndListing', payload: './playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json' }
    ]);
  }

  static async caseWorkerProgressPaperCaseToListing(caseId: string, issueDate?: string) {
    await this.caseWorkerSubmitPaperCase(caseId, issueDate);
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

  static async caseworkerCreateFlag(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'createFlags', payload: './playwright-e2e/data/payload/consented/caseworker/create-flag.json' }
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
  static async caseWorkerProgressToGeneralApplicationOutcome(caseId: string): Promise<string> {
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
   * Lists a case for hearing between 12 and 16 weeks after the issueDate.
   * (Not suitable for fast track or express cases.)
   * Callback will fail if hearingDate validation returns an error.
   * @param caseId - The CCD case ID to update
   * @param [isFormACase=true] - Whether the case is Form A or not.
   */
  static async caseworkerListForHearing12To16WeeksFromNow(caseId: string, isFormACase: boolean = true) {

    const currentDate = await DateHelper.getCurrentDate();
    const hearingDate = await DateHelper.getHearingDateUsingCurrentDate()

    isFormACase
      ? await PayloadHelper.caseWorkerProgressFormACaseToListing(caseId, currentDate)
      : await PayloadHelper.caseWorkerProgressPaperCaseToListing(caseId, currentDate);

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

  /**
   * Runs event "Approve Orders" as judiciary.
   *
   * @param caseId - The case identifier for which the order is being approved.
   * @param dynamicDraftOrderInfo - An object containing runtime values for the order document:
   *  - `documentUrl`: The URL of the uploaded draft order document.
   *  - `documentBinaryUrl`: The binary download URL of the document.
   *  - `uploadTimestamp`: The timestamp of when the document was uploaded.
   *  - `hearingDate`: The ISO string date of the hearing (e.g., '2025-08-06').
   */
  static async judgeApproveOrders(caseId: string,
    dynamicDraftOrderInfo: {
      documentUrl: string;
      documentBinaryUrl: string;
      uploadTimestamp: string;
      hearingDate: string;
    }) {
    const hearingDateLabel = DateHelper.formatToDayMonthYear(dynamicDraftOrderInfo.hearingDate);

    const approveOrdersDataModifications = [
      {
        action: 'insert',
        key: 'judgeApproval1.hearingInfo',
        value: `First Directions Appointment (FDA) on ${hearingDateLabel} 10:00`
      },
      { action: 'insert', key: 'judgeApproval1.hearingDate', value: dynamicDraftOrderInfo.hearingDate },
      { action: 'insert', key: 'judgeApproval1.document.document_url', value: dynamicDraftOrderInfo.documentUrl },
      { action: 'insert', key: 'judgeApproval1.document.document_binary_url', value: dynamicDraftOrderInfo.documentBinaryUrl },
      { action: 'insert', key: 'judgeApproval1.document.upload_timestamp', value: dynamicDraftOrderInfo.uploadTimestamp }
    ];

    const approveOrdersJsonObject = await this.createUpdatedJsonObjectFromFile(
      './playwright-e2e/data/payload/contested/judiciary/most-basic-approve-orders.json',
      approveOrdersDataModifications
    );

    await updateCaseInCcdFromJSONObject(
      config.judge.email,
      config.judge.password,
      caseId,
      'FinancialRemedyContested',
      'FR_approveOrders',
      approveOrdersJsonObject
    );
  }

  /**
   * Runs event "Process Order" as Caseworker.
   *
   * @param caseId - The case identifier for which the order is being approved.
   * @param dynamicDraftOrderInfo - An object containing runtime values for the order document:
   *  - `documentUrl`: The URL of the uploaded draft order document.
   *  - `documentBinaryUrl`: The binary download URL of the document.
   *  - `uploadTimestamp`: The timestamp of when the document was uploaded.
   *  - `hearingDate`: Not needed for this method.
   */
  static async caseWorkerProcessOrder(caseId: string,
    dynamicDraftOrderInfo: {
      documentUrl: string;
      documentBinaryUrl: string;
      uploadTimestamp: string;
      hearingDate: string;
    }
  ) {

    const orderDateTime = await DateHelper.getCurrentTimestamp();

    const processOrderDataModifications = [
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.orderDateTime', value: orderDateTime },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.document_url', value: dynamicDraftOrderInfo.documentUrl },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.document_binary_url', value: dynamicDraftOrderInfo.documentBinaryUrl },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.uploadDraftDocument.upload_timestamp', value: dynamicDraftOrderInfo.uploadTimestamp },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.document_url', value: dynamicDraftOrderInfo.documentUrl },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.document_binary_url', value: dynamicDraftOrderInfo.documentBinaryUrl },
      { action: 'insert', key: 'unprocessedApprovedDocuments[0].value.originalDocument.upload_timestamp', value: dynamicDraftOrderInfo.uploadTimestamp }
    ];

    const processOrderJsonObject = await this.createUpdatedJsonObjectFromFile(
      './playwright-e2e/data/payload/contested/caseworker/process-order/basic-two-hearing.json',
      processOrderDataModifications
    );

    await updateCaseInCcdFromJSONObject(
      config.caseWorker.email,
      config.caseWorker.password,
      caseId,
      'FinancialRemedyContested',
      'FR_directionOrder',
      processOrderJsonObject
    );
  }

}
