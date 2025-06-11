import { CaseDataBuilder } from "../CaseDataBuilder";
import { ContestedEvents, CaseType, PayloadPath } from "../../config/case-data";
import { PayloadHelper } from "./ContestedPayloadHelper";
import { 
  APPROVE_ORDERS_DATA, 
  EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT, 
  ESTIMATED_ASSETS_UNDER_1M, 
  LIST_FOR_HEARING, 
  PROCESS_ORDER_DATA, 
  REFER_LIST_DATA, 
  OUTCOME_LIST_DATA, 
  DIRECTIONS_LIST_DATA } from "../PayloadMutator";
import { DateHelper } from "../DateHelper";

export class ContestedCaseDataHelper {
  private static buildContestedCase({
    isPaper,
    replacements = [],
    event,
    payloadPath,
  }: {
    isPaper: boolean;
    replacements?: any[];
    event?: string;
    payloadPath?: string;
  }): Promise<string> {
    const derivedEvent =
      event ||
      (isPaper
        ? ContestedEvents.createPaperCase.ccdCallback
        : ContestedEvents.createCase.ccdCallback);

    const derivedPayloadPath =
      payloadPath ||
      (isPaper ? PayloadPath.Contested.paper : PayloadPath.Contested.formA);

    const builder = new CaseDataBuilder(CaseType.Contested, derivedEvent)
      [isPaper ? "withCaseWorkerUser" : "withSolicitorUser"]()
      .withPayload(derivedPayloadPath);

    if (replacements.length) builder.addReplacements(...replacements);
    return builder.create();
  }

  // Base builders
  static async createBaseContestedFormA(): Promise<string> {
    return this.buildContestedCase({
      isPaper: false,
      replacements: [
        { action: 'delete', key: 'divorcePetitionIssuedDate' },
        { action: 'insert', key: 'divorcePetitionIssuedDate', value: await DateHelper.getCurrentDate() },
      ]
    });
  }

  static createBaseContestedPaperCase(): Promise<string> {
    return this.buildContestedCase({ isPaper: true });
  }

  static createSchedule1Case(): Promise<string> {
    return this.buildContestedCase({
      isPaper: false,
      payloadPath: PayloadPath.Contested.schedule1,
    }
  )  }

  // Specialised variants
  static createContestedFormACaseWithExpressPilotEnrolled(): Promise<string> {
    return this.buildContestedCase({
      isPaper: false,
      replacements:
        EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
    });
  }

  static createContestedPaperCaseWithExpressPilotEnrolled(): Promise<string> {
    return this.buildContestedCase({
      isPaper: true,
      replacements:
        EXPRESS_PILOT_PARTICIPATING_COURT_REPLACEMENT,
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

  // Reusable helper for creating cases
  private static async createCase(
    isExpressPilot: boolean,
    isPaper: boolean
  ): Promise<string> {
    return isExpressPilot
      ? isPaper
        ? await this.createContestedPaperCaseWithExpressPilotEnrolled()
        : await this.createContestedFormACaseWithExpressPilotEnrolled()
      : isPaper
        ? await this.createBaseContestedPaperCase()
        : await this.createBaseContestedFormA();
  }

  // Workflow helpers
  static async createAndProcessFormACase(): Promise<string> {
    const caseId = await this.createBaseContestedFormA();
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerProgressFormACaseToListing(caseId);
    return caseId;
  }

  static async createAndProcessPaperCaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, true);
    await PayloadHelper.caseWorkerProgressPaperCaseToListing(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToIssueApplication(
    isExpressPilot = false,
    issueDate?: string
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerIssueApplication(caseId, true, issueDate);
    return caseId;
  }

  static async createAndProcessFormACaseUpToCreateFlag(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createAndProcessFormACaseUpToIssueApplication(isExpressPilot);
    await PayloadHelper.caseworkerCreateFlag(caseId);
    return caseId;
  }

  static async createAndSubmitPaperCase(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, true);
    await PayloadHelper.caseWorkerIssueApplication(caseId, false);
    return caseId;
  }

  static async createAndProcessSchedule1CaseUpToIssueApplication(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createSchedule1Case();
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerIssueApplication(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToAllocateJudge(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseworkerAllocateToJudge(caseId);
    return caseId;
  }

  static async caseworkerListForHearing12To16WeeksFromNow(
    caseId: string,
    isFormACase: boolean = true
  ): Promise<void> {
    const { currentDate, hearingDate } =
      await DateHelper.getFormattedHearingDate();

    if (isFormACase) {
      await PayloadHelper.caseWorkerProgressFormACaseToListing(
        caseId,
        currentDate
      );
    } else {
      await PayloadHelper.caseWorkerProgressPaperCaseToListing(
        caseId,
        currentDate
      );
    }

    const listForHearingDataModifications = LIST_FOR_HEARING(hearingDate);

    // Update the case in CCD
    await PayloadHelper.listCaseForHearing(caseId, listForHearingDataModifications);
  }

  static async progressToUploadDraftOrder({
    isFormA,
  }: {
    isFormA: boolean;
  }): Promise<string> {
    const caseId = isFormA
      ? await this.createBaseContestedFormA()
      : await this.createBaseContestedPaperCase();

    if (isFormA) {
      await PayloadHelper.solicitorSubmitFormACase(caseId);
    }

    await this.caseworkerListForHearing12To16WeeksFromNow(caseId, isFormA);

    return caseId;
  }

  static async judgeApproveOrders(
    caseId: string,
    dynamicDraftOrderInfo: {
      documentUrl: string;
      documentBinaryUrl: string;
      uploadTimestamp: string;
      hearingDate: string;
    }
  ): Promise<string> {
    const hearingDateLabel = DateHelper.formatToDayMonthYear(
      dynamicDraftOrderInfo.hearingDate
    );
    const modifications = APPROVE_ORDERS_DATA(
      hearingDateLabel,
      dynamicDraftOrderInfo.hearingDate,
      dynamicDraftOrderInfo.documentUrl,
      dynamicDraftOrderInfo.documentBinaryUrl,
      dynamicDraftOrderInfo.uploadTimestamp
    );

    // Update the case in CCD
    await PayloadHelper.approveOrders(caseId, modifications)

    // Return the JSON object
    return caseId;
  }

  static async caseWorkerProcessOrder(
    caseId: string,
    dynamicDraftOrderInfo: {
      documentUrl: string;
      documentBinaryUrl: string;
      uploadTimestamp: string;
    }
  ): Promise<string> {
    // Generate the JSON object for the process order payload
    const orderDateTime = await DateHelper.getCurrentTimestamp();
    const modifications = PROCESS_ORDER_DATA(
      orderDateTime,
      dynamicDraftOrderInfo.documentUrl,
      dynamicDraftOrderInfo.documentBinaryUrl,
      dynamicDraftOrderInfo.uploadTimestamp
    );

    await PayloadHelper.processOrder(caseId, modifications);

    // Return the JSON object
    return caseId;
  }

  // General Application Directions
  static async caseworkerProgressToGeneralApplicationReferToJudge(
    caseId: string
  ): Promise<string> {
    const generalApplicationId = await PayloadHelper.caseWorkerProgressToCreateGeneralApplication(caseId);
    const modifications = REFER_LIST_DATA(generalApplicationId);
    await PayloadHelper.generalApplicationReferToJudge(caseId, modifications)
    return generalApplicationId;
  }

  static async caseWorkerProgressToGeneralApplicationOutcome(
    caseId: string
  ): Promise<string> {
    const generalApplicationId = await this.caseworkerProgressToGeneralApplicationReferToJudge(caseId);
    const modifications = OUTCOME_LIST_DATA(generalApplicationId);
    await PayloadHelper.generalApplicationOutcome(caseId, modifications)
    return caseId;
  }

  static async caseWorkerCreateOldGeneralApplicationDirectionsHearing(
    caseId: string
  ): Promise<string> {
    const codeForDirections = await this.caseWorkerProgressToGeneralApplicationOutcome(caseId);
    const modifications = DIRECTIONS_LIST_DATA(codeForDirections);
    await PayloadHelper.generalApplicationDirections(caseId, modifications);
    return caseId
  }
}
