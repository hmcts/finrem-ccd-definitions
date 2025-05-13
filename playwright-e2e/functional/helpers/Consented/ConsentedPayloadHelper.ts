import { apiHelper } from "../../../fixtures/fixtures";
import config from "../../../config/config";
import { consentedEvents } from "../../../config/case_events";
import { CaseType, PayloadPath } from "../../../pages/helpers/enums/CaseDataEnums";

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

  static async solicitorSubmitFormACase(caseId: string) {
    await apiHelper.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Consented,
      consentedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Consented.base
    );
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: consentedEvents.hwfDecisionMade.ccdCallback, payload: PayloadPath.Consented.base },
    ]);
  }

  static async caseWorkerIssueApplication(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      { event: consentedEvents.hwfDecisionMade.ccdCallback, payload: PayloadPath.Consented.base },
      { event: consentedEvents.issueApplication.ccdCallback, payload: PayloadPath.Consented.base },
    ]);
  }

  static async caseworkerCreateFlag(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: consentedEvents.createFlag.ccdCallback , payload: PayloadPath.Consented.createFlag }
    ]);
  }
}
