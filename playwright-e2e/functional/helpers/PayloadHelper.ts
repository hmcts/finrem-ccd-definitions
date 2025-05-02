import fs from 'fs';
import path from 'path';
import { updateCaseInCcd } from '../../../test/helpers/utils';
import config from '../../config/config';
import { CaseDataHelper } from './CaseDataHelper';

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

  static async caseWorkerProgressToCreateGeneralApplication(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: 'createGeneralApplication', payload: './playwright-e2e/data/payload/contested/caseworker/create-general-application/applicant-no-hearing-no-optional.json' }
    ]);
  }

  static async caseWorkerProgressToGeneralApplicationOutcome(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    const response = await updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      'FinancialRemedyContested',
      'createGeneralApplication',
      './playwright-e2e/data/payload/contested/caseworker/general-application-outcome/1.create-general-application.json'
    );

    const generalApplicationId = response.case_data.appRespGeneralApplications[0].id;

    // Todo: Make an JSON object, looks like your file, with the dynamic id.  then pass to new updateCaseInCcdFromJSON file.

    // await this.updateCaseWorkerSteps(caseId, [
    //   { event: 'FR_generalApplicationReferToJudge', payload: replacement }
    // ]);
    // await this.caseWorkerProgressToReferToJudge(caseId);
    // await this.updateCaseWorkerSteps(caseId, [
    //   { event: 'FR_GeneralApplicationOutcome', payload: './playwright-e2e/data/payload/contested/caseworker/general-application-outcome.json' }
    // ]);
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
}
