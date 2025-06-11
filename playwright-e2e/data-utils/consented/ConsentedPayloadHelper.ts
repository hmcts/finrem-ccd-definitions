import { apiHelper } from "../../fixtures/fixtures";
import config from "../../config/config";
import { ConsentedEvents, CaseType, PayloadPath } from "../../config/case-data";

export class PayloadHelper {
  private static async updateCaseWorkerSteps(
    caseId: string,
    steps: { event: string; payload?: string }[]
  ): Promise<void> {
    for (const step of steps) {
      await apiHelper.updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        CaseType.Consented,
        step.event,
        step.payload || ""
      );
    }
  }

  static async solicitorSubmitCase(caseId: string) {
    await apiHelper.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      ConsentedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Consented.base
    );
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.hwfDecisionMade.ccdCallback, payload: PayloadPath.Consented.base },
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.caseWorkerHWFDecisionMade(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.issueApplication.ccdCallback, payload: PayloadPath.Consented.base },
    ]);
  }

  static async caseworkerCreateFlag(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.createFlag.ccdCallback , payload: PayloadPath.Consented.createFlag }
    ]);
  }
}
