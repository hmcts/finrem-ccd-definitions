import fs from "fs";
import { ccdApi } from "../../../fixtures/fixtures";
import config from "../../../config/config";
import { ContestedEvents, CaseType, PayloadPath } from "../../../config/case-data";
import { ReplacementAction } from "../../../types/replacement-action";
import { APPROVE_ORDERS_DATA, ISSUE_APPLICATION, PROCESS_ORDER_DATA } from "../../PayloadMutator";
import { DateHelper } from "../../DateHelper";

export class ContestedEventApi {
  private static async updateCaseWorkerSteps(
    caseId: string,
    steps: { event: string; payload?: string }[]
  ): Promise<any> {
    let response;
    for (const step of steps) {
      response = await ccdApi.updateCaseInCcd(
        config.caseWorker.email,
        config.caseWorker.password,
        caseId,
        CaseType.Contested,
        step.event,
        step.payload || ""
      );
    }
    return response;
  }

  static async updateStepsFromJson(
    caseId: string,
    asCaseWorker: boolean,
    steps: { event: string; jsonObject?: string }[],
    // jsonObject?: string
  ): Promise<any> {
    const { email, password } = asCaseWorker ? config.caseWorker : config.judge;
    for (const step of steps) {
      await ccdApi.updateCaseInCcdFromJSONObject(
        email,
        password,
        caseId,
        CaseType.Contested,
        step.event,
        step.jsonObject || ""
      );
    }
  }

  static async updateCaseWithJson(
    caseId: string,
    event: string,
    jsonObject: string,
    asCaseWorker: boolean
  ): Promise<void> {
    await this.updateStepsFromJson(caseId, asCaseWorker, [
      {
        event,
        jsonObject,
      },
    ]);
  }

  private static async progressCaseToState(
    caseId: string,
    event: string,
    payloadPath: string,
    modifications: any[] = [],
    asCaseWorker: boolean = true
  ): Promise<void> {
    const jsonObject = await ContestedEventApi.createUpdatedJsonObjectFromFile(
      payloadPath,
      modifications
    );
    await this.updateCaseWithJson(caseId, event, jsonObject, asCaseWorker);
  }

  /**
   * Loads a JSON file, applies the given modifications, and returns an updated JSON object.
   *
   * @param filePath - Path to the JSON file
   * @param dataModifications - How the JSON needs changing
   * @returns Updated json as an object
   */
  static async createUpdatedJsonObjectFromFile(
    filePath: string,
    dataModifications: ReplacementAction[]
  ): Promise<string> {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(fileContent);
    ccdApi.makeModifications(dataModifications, json);
    return json;
  }

  static async solicitorSubmitFormACase(caseId: string) {
    await ccdApi.updateCaseInCcd(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      caseId,
      CaseType.Contested,
      ContestedEvents.applicationPaymentSubmission.ccdCallback,
      PayloadPath.Contested.formASubmit
    );
  }

  static async caseWorkerHwfDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.hwfDecisionMade.ccdCallback,
        payload: PayloadPath.Contested.hwfDecisionMade,
      },
    ]);
  }

  static async caseWorkerManualPayment(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.manualPayment.ccdCallback,
        payload: PayloadPath.Contested.manualPayment,
      },
    ]);
  }

  /**
   * Issues an application as a caseworker.
   * 1. Makes the HWF decision as a caseworker.
   * 2. If an `issueDate` is provided:
   *    - Modifies the issue application payload the `issueDate`, runs the `FR_issueApplication` event.
   * 3. If no `issueDate` is provided:
   *    - Runs the `FR_issueApplication` event with a static payload.
   *
   * @param caseId - The unique identifier for the case.
   * @param issueDate - Optional ISO date string (`YYYY-MM-DD`) for the issue application payload.
   * @param isFormACase - Default is true.  Required for Form A cases. Skip for Paper by passing false.
   */
  static async caseWorkerIssueApplication(
    caseId: string,
    isFormACase: boolean = true,
    issueDate?: string
  ) {
    if (isFormACase) {
      await this.caseWorkerHWFDecisionMade(caseId);
    } else {
      await this.caseWorkerManualPayment(caseId);
    }

    if (issueDate) {
      const issueApplicationJsonObject =
        await this.createUpdatedJsonObjectFromFile(
          PayloadPath.Contested.issueApplication,
          ISSUE_APPLICATION(issueDate)
        );

      await this.updateStepsFromJson(caseId, true, [
        {
          event: ContestedEvents.issueApplication.ccdCallback,
          jsonObject: issueApplicationJsonObject,
        },
      ]);
    } else {
      await this.updateCaseWorkerSteps(caseId, [
        {
          event: ContestedEvents.issueApplication.ccdCallback,
          payload: PayloadPath.Contested.issueApplication,
        },
      ]);
    }
  }

  static async caseWorkerHWFDecisionMade(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.hwfDecisionMade.ccdCallback,
        payload: PayloadPath.Contested.hwfDecisionMade,
      },
    ]);
  }

  static async caseworkerAddsApplicantIntervener(
    caseId: string,
  ): Promise<void> {
    await this.updateCaseWorkerSteps( caseId, [
      {
        event: ContestedEvents.manageInterveners.ccdCallback,
        payload: PayloadPath.Contested.manageIntervenersAddApplicantInt,
      }
    ])
  }

  static async caseworkerAddsRespondentIntervener(
    caseId: string,
    ): Promise<void> {
        await this.updateCaseWorkerSteps( caseId, [
        {
            event: ContestedEvents.manageInterveners.ccdCallback,
            payload: PayloadPath.Contested.manageIntervenersAddRespondentInt,
        }
        ])
    }

    static async caseworkerAddsApplicantBarrister(
    caseId: string,
    ): Promise<void> {
        await this.updateCaseWorkerSteps( caseId, [
        {
            event: ContestedEvents.manageBarrister.ccdCallback,
            payload: PayloadPath.Contested.manageBarristerAddApplicantBarrister,
        }
        ])
    }

    static async caseworkerAddsRespondentBarrister(
    caseId: string,
    ): Promise<void> {
        await this.updateCaseWorkerSteps( caseId, [
        {
            event: ContestedEvents.manageBarrister.ccdCallback,
            payload: PayloadPath.Contested.manageBarristerAddRespondentBarrister,
        }
        ])
    }

  static async caseWorkerProgressFormACaseToListing(
    caseId: string,
    issueDate?: string
  ) {
    await this.caseWorkerIssueApplication(caseId, true, issueDate);
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.progressToListing.ccdCallback,
        payload: PayloadPath.Contested.progressToListing,
      },
    ]);
  }

  static async caseWorkerProgressPaperCaseToListing(
    caseId: string,
    issueDate?: string
  ) {
    await this.caseWorkerIssueApplication(caseId, false, issueDate);
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.progressToListing.ccdCallback,
        payload: PayloadPath.Contested.progressToListing,
      },
    ]);
  }

  static async caseworkerAllocateToJudge(caseId: string) {
    await this.caseWorkerIssueApplication(caseId);
    await this.updateCaseWorkerSteps(caseId, [
      { event: ContestedEvents.allocateToJudge.ccdCallback },
    ]);
  }

  static async caseWorkerProgressToCreateGeneralApplication(
    caseId: string
  ): Promise<string> {
    const response = await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.createGeneralApplication.ccdCallback,
        payload: PayloadPath.Contested.generalApplicationCreate,
      },
    ]);
    return response.case_data.appRespGeneralApplications[0].id;
  }

  static async generalApplicationReferToJudge(
    caseId: string,
    jsonObject: any[] = []
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.generalApplicationReferToJudge.ccdCallback,
      PayloadPath.Contested.referToJudgeEmailIsNull,
      jsonObject
    );
  }

  static async generalApplicationOutcome(
    caseId: string,
    jsonObject: any[] = []
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.generalApplicationOutcome.ccdCallback,
      PayloadPath.Contested.generalApplicationOutcomeOther,
      jsonObject
    );
  }

  static async generalApplicationDirections(
    caseId: string,
    jsonObject: any[] = []
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.generalApplicationDirections.ccdCallback,
      PayloadPath.Contested.generalApplicationOldHearingRequiredYes,
      jsonObject
    );
  }

  static async listCaseForHearing(
    caseId: string,
    jsonObject: any[] =[]
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.listForHearing.ccdCallback,
      PayloadPath.Contested.listForHearingFdaEgOne,
      jsonObject,
      true
    );
  }

  static async approveOrders(
    caseId: string,
    jsonObject: any[] = []
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.approveOrders.ccdCallback,
      PayloadPath.Contested.judiciaryBasicApproveOrders,
      jsonObject,
      false
    );
  }

  static async processOrderLegacy(
    caseId: string, 
    jsonObject: any[] = []
  ): Promise<void> {
    await this.progressCaseToState(
      caseId,
      ContestedEvents.processOrder.ccdCallback,
      PayloadPath.Contested.processOrderBasicTwoHearing,
      jsonObject
    );
  }

  static async agreedDraftOrderApplicant(
    caseId: string,
  ): Promise<void> {
    await this.updateCaseWorkerSteps( caseId, [
  {
    event: ContestedEvents.uploadDraftOrders.ccdCallback,
    payload: PayloadPath.Contested.agreedDraftOrderApplicant,
  }])
}

  static async caseworkerCreateFlag(caseId: string) {
    
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.createFlag.ccdCallback,
        payload: PayloadPath.Contested.createFlag,
      },
    ]);
  }

  static async caseWorkerProcessOrderLegacy(
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

    await ContestedEventApi.processOrderLegacy(caseId, modifications);

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
      courtOrderDate: string;
    }
  ): Promise<string> {
    
    const hearingDateLabel = DateHelper.formatToDayMonthYear(
      dynamicDraftOrderInfo.hearingDate
    );
  
    const modifications = APPROVE_ORDERS_DATA(
      hearingDateLabel,
      dynamicDraftOrderInfo.hearingDate,
      dynamicDraftOrderInfo.courtOrderDate,
      dynamicDraftOrderInfo.documentUrl,
      dynamicDraftOrderInfo.documentBinaryUrl,
      dynamicDraftOrderInfo.uploadTimestamp
    );

    // Update the case in CCD
    await ContestedEventApi.approveOrders(caseId, modifications)

    // Return the JSON object
    return caseId;
  }

  static async caseWorkerPerformsAddAHearing(caseId: string) {
    await this.updateCaseWorkerSteps(caseId, [
      {
        event: ContestedEvents.manageHearings.ccdCallback,
        payload: PayloadPath.Contested.manageHearingAddHearing,
      },
    ]);
  }

}
