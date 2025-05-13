import { CaseDataBuilder } from "../CaseDataBuilder";
import { CaseType, PayloadPath } from "../../../pages/helpers/enums/CaseDataEnums";
import { contestedEvents } from "../../../config/case_events";
import { EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT, ESTIMATED_ASSETS_UNDER_1M } from "../PayloadMutator";
import { PayloadHelper } from "./ContestedPayloadHelper";

export class ContestedCaseHelper {

  private static buildContestedCase({
    isPaper,
    replacements = [],
  }: {
    isPaper: boolean;
    replacements?: any[];
  }): Promise<string> {
    // Determine the event and payload path based on whether it's a paper case or not
    const event = isPaper
      ? contestedEvents.createPaperCase.ccdCallback
      : contestedEvents.createCase.ccdCallback;

    const payloadPath = isPaper
      ? PayloadPath.Contested.paper
      : PayloadPath.Contested.formA;

    const builder = new CaseDataBuilder(CaseType.Contested, event)
      [isPaper ? "withCaseWorkerUser" : "withSolicitorUser"]()
      .withPayload(payloadPath);

    if (replacements.length) builder.addReplacements(...replacements);
    return builder.create();
  }

  // Base builders
  static createBaseContestedFormA(): Promise<string> {
    return this.buildContestedCase({
      isPaper: false,
    });
  }

  static createBaseContestedPaperCase(): Promise<string> {
    return this.buildContestedCase({
      isPaper: true,
    });
  }

  // Specialised variants
  static createContestedFormACaseWithExpressPilotEnrolled(): Promise<string> {
    return this.buildContestedCase({
      isPaper: false,
      replacements: EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
    });
  }

  static createContestedPaperCaseWithExpressPilotEnrolled(): Promise<string> {
    return this.buildContestedCase({
      isPaper: true,
      replacements: EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
    });
  }

  static createContestedPaperCaseWithEstimatedAssetUnder1M(): Promise<string> {
    return this.buildContestedCase({
      isPaper: true,
      replacements: [
        ...EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
        ...ESTIMATED_ASSETS_UNDER_1M,
      ],
    });
  }

  // Workflow helpers
  static async createAndProcessFormACaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = isExpressPilot
      ? await this.createContestedFormACaseWithExpressPilotEnrolled()
      : await this.createBaseContestedFormA();

    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerProgressToListing(caseId);
    return caseId;
  }

  static async createAndSubmitPaperCaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = isExpressPilot
      ? await this.createContestedPaperCaseWithExpressPilotEnrolled()
      : await this.createBaseContestedPaperCase();

    await PayloadHelper.caseWorkerProgressPaperCaseToListing(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToIssueApplication(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = isExpressPilot
      ? await this.createContestedFormACaseWithExpressPilotEnrolled()
      : await this.createBaseContestedFormA();

    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerIssueApplication(caseId);
    return caseId;
  }

  static async createAndSubmitPaperCase(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = isExpressPilot
      ? await this.createContestedPaperCaseWithExpressPilotEnrolled()
      : await this.createBaseContestedPaperCase();

    await PayloadHelper.caseWorkerSubmitPaperCase(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToAllocateJudge(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = isExpressPilot
      ? await this.createContestedFormACaseWithExpressPilotEnrolled()
      : await this.createBaseContestedFormA();

    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseworkerAllocateToJudge(caseId);
    return caseId;
  }
}
