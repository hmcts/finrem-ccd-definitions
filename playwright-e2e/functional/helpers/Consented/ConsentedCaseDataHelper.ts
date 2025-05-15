import { CaseDataBuilder } from "../CaseDataBuilder";
import { consentedEvents } from "../../../config/case_events";
import { PayloadHelper } from "./ConsentedPayloadHelper";
import { CaseType, PayloadPath } from "../../../pages/helpers/enums/CaseDataEnums";

export class ConsentedCaseDataHelper {

  private static async buildConsentedCaseWithSteps(
    steps: ((caseId: string) => Promise<void>)[]
  ): Promise<string> {
    const caseId = await new CaseDataBuilder(
      CaseType.Consented,
      consentedEvents.createCase.ccdCallback
    )
      .withSolicitorUser()
      .withPayload(PayloadPath.Consented.base)
      .create();
    for (const step of steps) {
      await step(caseId);
    }
    return caseId;
  }

  static async createConsentedCase(): Promise<string> {
    return this.buildConsentedCaseWithSteps([]);
  }

  static async createConsentedCaseUpToApplicationPaymentSubmission(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => PayloadHelper.solicitorSubmitFormACase(id),
    ]);
  }

  static async createConsentedCaseUpToHWFDecision(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => PayloadHelper.solicitorSubmitFormACase(id),
      (id) => PayloadHelper.caseWorkerHWFDecisionMade(id),
    ]);
  }

  static async createConsentedCaseUpToIssueApplication(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => PayloadHelper.solicitorSubmitFormACase(id),
      (id) => PayloadHelper.caseWorkerIssueApplication(id),
    ]);
  }

  static async createConsentedCaseUpToCreateFlag(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => PayloadHelper.solicitorSubmitFormACase(id),
      (id) => PayloadHelper.caseworkerCreateFlag(id),
    ]);
  }
}
