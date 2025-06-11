import { CaseDataBuilder } from "../CaseDataBuilder";
import { ConsentedEvents, CaseType, PayloadPath } from "../../config/case-data";
import { ConsentedEventApi } from "./ConsentedEventApi";

export class ConsentedCaseFactory {

  private static async buildConsentedCaseWithSteps(
    steps: ((caseId: string) => Promise<void>)[]
  ): Promise<string> {
    const caseId = await new CaseDataBuilder(
      CaseType.Consented,
      ConsentedEvents.createCase.ccdCallback
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
      (id) => ConsentedEventApi.solicitorSubmitCase(id),
    ]);
  }

  static async createConsentedCaseUpToHWFDecision(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => ConsentedEventApi.solicitorSubmitCase(id),
      (id) => ConsentedEventApi.caseWorkerHWFDecisionMade(id),
    ]);
  }

  static async createConsentedCaseUpToIssueApplication(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => ConsentedEventApi.solicitorSubmitCase(id),
      (id) => ConsentedEventApi.caseWorkerIssueApplication(id),
    ]);
  }

  static async createConsentedCaseUpToCreateFlag(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => ConsentedEventApi.solicitorSubmitCase(id),
      (id) => ConsentedEventApi.caseworkerCreateFlag(id),
    ]);
  }
}
