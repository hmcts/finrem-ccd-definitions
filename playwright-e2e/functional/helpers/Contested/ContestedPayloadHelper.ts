import { apiHelper } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { contestedEvents } from "../../../config/case_events";
import { CaseType, PayloadPath } from "../../../pages/helpers/enums/CaseDataEnums";

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
      contestedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Contested.formASubmit
    );
  }

  static async caseWorkerHwfDecisionMade(caseId : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.hwfDecisionMade.ccdCallback, payload: PayloadPath.Contested.hwfDecisionMade },
    ]);
  }

  static async caseWorkerManualPayment(caseId : string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.manualPayment.ccdCallback, payload: PayloadPath.Contested.manualPayment },
    ]);
  }

  static async caseWorkerSubmitPaperCase(caseId : string) {
    await this.caseWorkerManualPayment(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.issueApplication.ccdCallback, payload: PayloadPath.Contested.issueApplication },
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.caseWorkerHwfDecisionMade(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.issueApplication.ccdCallback, payload: PayloadPath.Contested.issueApplication }
    ]);
  }

  static async caseWorkerProgressToListing(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.progressToListing.ccdCallback, payload: PayloadPath.Contested.progressToListing }
    ]);
  }

  static async caseWorkerProgressPaperCaseToListing(caseId: string) {
    await this.caseWorkerSubmitPaperCase(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.progressToListing.ccdCallback, payload: PayloadPath.Contested.progressToListing }
    ]);
  }

  static async caseworkerAllocateToJudge(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: contestedEvents.allocateToJudge.ccdCallback }
    ]);
  }
}
