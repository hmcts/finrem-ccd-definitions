import { CaseDataBuilder } from "../CaseDataBuilder";
import { ContestedEvents, CaseType, PayloadPath } from "../../config/case-data";
import { ContestedEventApi } from "./ContestedEventApi";
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

export class ContestedCaseFactory {
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
    await ContestedEventApi.solicitorSubmitFormACase(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await ContestedEventApi.solicitorSubmitFormACase(caseId);
    await ContestedEventApi.caseWorkerProgressFormACaseToListing(caseId);
    return caseId;
  }

  static async createAndProcessPaperCaseUpToProgressToListing(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, true);
    await ContestedEventApi.caseWorkerProgressPaperCaseToListing(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToIssueApplication(
    isExpressPilot = false,
    issueDate?: string
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await ContestedEventApi.solicitorSubmitFormACase(caseId);
    await ContestedEventApi.caseWorkerIssueApplication(caseId, true, issueDate);
    return caseId;
  }

  static async createAndProcessFormACaseUpToCreateFlag(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createAndProcessFormACaseUpToIssueApplication(isExpressPilot);
    await ContestedEventApi.caseworkerCreateFlag(caseId);
    return caseId;
  }

  static async createAndSubmitPaperCase(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, true);
    await ContestedEventApi.caseWorkerIssueApplication(caseId, false);
    return caseId;
  }

  static async createAndProcessSchedule1CaseUpToIssueApplication(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createSchedule1Case();
    await ContestedEventApi.solicitorSubmitFormACase(caseId);
    await ContestedEventApi.caseWorkerIssueApplication(caseId);
    return caseId;
  }

  static async createAndProcessFormACaseUpToAllocateJudge(
    isExpressPilot = false
  ): Promise<string> {
    const caseId = await this.createCase(isExpressPilot, false);
    await ContestedEventApi.solicitorSubmitFormACase(caseId);
    await ContestedEventApi.caseworkerAllocateToJudge(caseId);
    return caseId;
  }

  static async caseWorkerProgressToGeneralApplicationOutcome(
    caseId: string
  ): Promise<string> {
    const generalApplicationId = await this.caseworkerProgressToGeneralApplicationReferToJudge(caseId);
    const modifications = OUTCOME_LIST_DATA(generalApplicationId);
    await ContestedEventApi.generalApplicationOutcome(caseId, modifications)
    return caseId;
  }

  static async caseWorkerCreateOldGeneralApplicationDirectionsHearing(
    caseId: string
  ): Promise<string> {
    const codeForDirections = await this.caseWorkerProgressToGeneralApplicationOutcome(caseId);
    const modifications = DIRECTIONS_LIST_DATA(codeForDirections);
    await ContestedEventApi.generalApplicationDirections(caseId, modifications);
    return caseId
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
      await ContestedEventApi.solicitorSubmitFormACase(caseId);
    }

    await this.caseworkerListForHearing12To16WeeksFromNow(caseId, isFormA);

    return caseId;
  }

  // General Application Directions
  private static async caseworkerProgressToGeneralApplicationReferToJudge(
    caseId: string
  ): Promise<string> {
    const generalApplicationId = await ContestedEventApi.caseWorkerProgressToCreateGeneralApplication(caseId);
    const modifications = REFER_LIST_DATA(generalApplicationId);
    await ContestedEventApi.generalApplicationReferToJudge(caseId, modifications)
    return generalApplicationId;
  }

  private static async caseworkerListForHearing12To16WeeksFromNow(
    caseId: string,
    isFormACase: boolean = true
  ): Promise<void> {
    const { currentDate, hearingDate } =
      await DateHelper.getFormattedHearingDate();

    if (isFormACase) {
      await ContestedEventApi.caseWorkerProgressFormACaseToListing(
        caseId,
        currentDate
      );
    } else {
      await ContestedEventApi.caseWorkerProgressPaperCaseToListing(
        caseId,
        currentDate
      );
    }

    const listForHearingDataModifications = LIST_FOR_HEARING(hearingDate);

    await ContestedEventApi.listCaseForHearing(caseId, listForHearingDataModifications);
  }

   ////------------------------////
   // Move to payload helper vv //
   ////------------------------////

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

    await ContestedEventApi.processOrder(caseId, modifications);

    // Return the JSON object
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
    await ContestedEventApi.approveOrders(caseId, modifications)

    // Return the JSON object
    return caseId;
  }

}
