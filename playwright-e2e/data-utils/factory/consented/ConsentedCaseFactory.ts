import { CaseDataBuilder } from '../CaseDataBuilder';
import { ConsentedEvents, CaseType, PayloadPath } from '../../../config/case-data';
import { ConsentedEventApi } from '../../api/consented/ConsentedEventApi';
import type { ReplacementAction } from '../../../types/replacement-action';

export class ConsentedCaseFactory {

  private static async buildConsentedCaseWithSteps(
    steps: ((caseId: string) => Promise<void>)[],
    replacements: ReplacementAction[] = []
  ): Promise<string> {
    const caseId = await new CaseDataBuilder(
      CaseType.Consented,
      ConsentedEvents.createCase.ccdCallback
    )
      .withSolicitorUser()
      .withPayload(PayloadPath.Consented.base)
      .addReplacements(...replacements)
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
    replacements: ReplacementAction[] = []
  ): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseWorkerIssueApplication(id);}
    ], replacements);
  }

  static async createConsentedCaseUpToCreateFlag(): Promise<string> {
    return this.buildConsentedCaseWithSteps([
      (id) => {return ConsentedEventApi.solicitorSubmitCase(id);},
      (id) => {return ConsentedEventApi.caseworkerCreateFlag(id);}
    ]);
  }
}
