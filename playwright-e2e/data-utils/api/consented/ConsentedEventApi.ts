import { ccdApi } from "../../../fixtures/fixtures";
import config from "../../../config/config";
import { ConsentedEvents, CaseType, PayloadPath } from "../../../config/case-data";

export class ConsentedEventApi {
  private static async updateCaseWorkerSteps(
    caseId: string,
    steps: { event: string; payload?: string }[]
  ): Promise<void> {
    for (const step of steps) {
      await ccdApi.updateCaseInCcd(
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
    await ccdApi.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      ConsentedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Consented.applicationPaymentSubmission
    );
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.hwfDecisionMade.ccdCallback},
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.caseWorkerHWFDecisionMade(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.issueApplication.ccdCallback, payload: PayloadPath.Consented.issueApplication },
    ]);
  }

  static async caseworkerCreateFlag(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ConsentedEvents.createFlag.ccdCallback , payload: PayloadPath.Consented.createFlag }
    ]);
  }
}
