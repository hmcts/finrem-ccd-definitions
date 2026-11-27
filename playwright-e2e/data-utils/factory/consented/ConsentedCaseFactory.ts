import { CaseDataBuilder } from '../CaseDataBuilder';
import { ConsentedEvents, CaseType, PayloadPath } from '../../../config/case-data';
import { ConsentedEventApi } from '../../api/consented/ConsentedEventApi';
import type { ReplacementAction } from '../../../types/replacement-action';

export type ConsentedCaseOptions = {
  // Upload a document for this case instead of using the shared test document.
  // Needed when a test reads the case's documents (e.g. Approve Application
  // stamps the consent order) while other tests create cases in parallel.
  uniqueDocuments?: boolean;
};

export class ConsentedCaseFactory {

  private static async buildConsentedCaseWithSteps(
    steps: ((caseId: string) => Promise<void>)[],
    replacements: ReplacementAction[] = [],
    { uniqueDocuments = false }: ConsentedCaseOptions = {}
  ): Promise<string> {
    const builder = new CaseDataBuilder(
      CaseType.Consented,
      ConsentedEvents.createCase.ccdCallback
    )
      .withSolicitorUser()
      .withPayload(PayloadPath.Consented.base)
      .addReplacements(...replacements);
    if (uniqueDocuments) {
      builder.withUniqueDocument();
    }
    const caseId = await builder.create();
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
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);}
    ]);
  }

  static async createConsentedCaseUpToHWFDecision(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseWorkerHWFDecisionMade(id);}
    ]);
  }

  static async createConsentedCaseUpToHwfFeeAccountDebited(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseWorkerHwfFeeAccountDebited(id);}
    ]);
  }

  static async createConsentedCaseUpToIssueApplication(
    replacements: ReplacementAction[] = [],
    options: ConsentedCaseOptions = {}
  ): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseWorkerIssueApplication(id);}
    ], replacements, options);
  }

  static async createConsentedCaseUpToCreateFlag(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseworkerCreateFlag(id);}
    ]);
  }
}
