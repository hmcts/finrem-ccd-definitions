// Enums for Case Types and User Types
export enum CaseType {
  Consented = "FinancialRemedyMVP2",
  Contested = "FinancialRemedyContested"
}

export enum UserType {
  Solicitor = "solicitor",
  Caseworker = "caseworker"
}

// Interface for Case Events
export interface CaseEvent {
  listItem: string;
  ccdCallback: string;
}

// Common Events (shared between Consented and Contested cases)
export const CommonEvents: Record<string, CaseEvent> = {
  applicationPaymentSubmission: {
    listItem: "Case Submission",
    ccdCallback: "FR_applicationPaymentSubmission"
  },
  hwfDecisionMade: {
    listItem: "HWF Application Accepted",
    ccdCallback: "FR_HWFDecisionMade"
  },
  issueApplication: {
    listItem: "Issue Application",
    ccdCallback: "FR_issueApplication"
  },
  createFlag: {
    listItem: "Create Flag",
    ccdCallback: "createFlags"
  },
  manageFlags: {
    listItem: "Manage Flags",
    ccdCallback: "manageFlags"
  },
};

// Consented Events
export const ConsentedEvents: Record<string, CaseEvent> = {
  createCase: {
    listItem: "Consent Order Application",
    ccdCallback: "FR_solicitorCreate"
  },
  approveApplication: {
    listItem: "Approve Application",
    ccdCallback: "FR_approveApplication"
  },
  sendOrder: {
    listItem: "Send Order",
    ccdCallback: "FR_sendOrderForApproved"
  },
  updateContactDetails: {
    listItem: "Update contact details",
    ccdCallback: "FR_updateContactDetails"
  },
  // Common events
  createFlag: CommonEvents.createFlag,
  manageFlags: CommonEvents.manageFlags,
  applicationPaymentSubmission: CommonEvents.applicationPaymentSubmission,
  hwfDecisionMade: CommonEvents.hwfDecisionMade,
  issueApplication: CommonEvents.issueApplication
};

// Contested Events
export const ContestedEvents: Record<string, CaseEvent> = {
  createCase: {
    listItem: "Form A Application",
    ccdCallback: "FR_solicitorCreate"
  },
  createPaperCase: {
    listItem: "Paper Case",
    ccdCallback: "FR_newPaperCase"
  },
  progressToListing: {
    listItem: "Progress to Listing",
    ccdCallback: "FR_progressToSchedulingAndListing"
  },
  listForHearing: {
    listItem: "List for Hearing",
    ccdCallback: "FR_addSchedulingListingInfo"
  },
  amendFormAApplicationDetails: {
    listItem: "Amend Application Details",
    ccdCallback: "FR_amendApplication"
  },
  manageExpressCase: {
    listItem: "Manage Express Case",
    ccdCallback: "FR_manageExpressCase"
  },
  giveAllocationDirection: {
    listItem: "Give Allocation Directions",
    ccdCallback: "FR_giveAllocationDirections"
  },
  amendPaperApplicationDetails: {
    listItem: "Amend Application Details",
    ccdCallback: "FR_amendPaperApplication"
  },
  manualPayment: {
    listItem: "Manual Payment",
    ccdCallback: "FR_manualPayment"
  },
  allocateToJudge: {
    listItem: "Allocate to Judge",
    ccdCallback: "FR_allocateToJudge"
  },
  listForInterimHearing: {
    listItem: "List for Interim Hearing",
    ccdCallback: "FR_listForInterimHearing"
  },
  uploadDraftOrders: {
      listItem: "Upload draft orders",
      ccdCallback: "FR_draftOrders"
  },
  generalApplicationDirections: {
    listItem: "General Application Directions",
    ccdCallback: "FR_GeneralApplicationDirections"
  },
  createGeneralApplication: {
    listItem: "Create General Application",
    ccdCallback: "createGeneralApplication"
  },
  generalApplicationReferToJudge: {
    listItem: "General Application Refer to Judge",
    ccdCallback: "FR_generalApplicationReferToJudge"
  },
  generalApplicationOutcome: {
    listItem: "General Application Outcome",
    ccdCallback: "FR_GeneralApplicationOutcome"
  },
  approveOrders: {
    listItem: "Approve Orders",
    ccdCallback: "FR_approveOrders"
  },
  directionOrder: {
    listItem: "Direction Order",
    ccdCallback: "FR_directionOrder"
  },
  // Common events
  createFlag: CommonEvents.createFlag,
  manageFlags: CommonEvents.manageFlags,
  applicationPaymentSubmission: CommonEvents.applicationPaymentSubmission,
  hwfDecisionMade: CommonEvents.hwfDecisionMade,
  issueApplication: CommonEvents.issueApplication
};

// Payload Paths
export const PayloadPath = {
  Consented: {
    base: "./playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json",
    createFlag: "./playwright-e2e/data/payload/consented/caseworker/create-flag.json"
  },
  Contested: {
    base: "./playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json",
    formA: "./playwright-e2e/data/payload/contested/forma/ccd-contested-base.json",
    formASubmit: "./playwright-e2e/data/payload/contested/solicitor/case-submission.json",
    paper: "./playwright-e2e/data/payload/contested/paper_case/ccd-contested-base.json",
    schedule1: "./playwright-e2e/data/payload/contested/solicitor/schedule1-create-case.json",
    hwfPayment: "./playwright-e2e/data/payload/contested/caseworker/HWF-payment.json",
    hwfDecisionMade: "./playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json",
    manualPayment: "./playwright-e2e/data/payload/contested/caseworker/manual-payment.json",
    issueApplication: "./playwright-e2e/data/payload/contested/caseworker/issue-application.json",
    refugePaperCase: "./playwright-e2e/data/payload/contested/paper_case/ccd-contested-refuge-applicant.json",
    progressToListing: "./playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json",
    generalApplicationCreate: "./playwright-e2e/data/payload/contested/caseworker/create-general-application/sender-is-applicant.json",
    referToJudgeEmailIsNull: "./playwright-e2e/data/payload/contested/caseworker/refer-to-judge/judge-email-is-null.json",
    generalApplicationOutcomeOther: "./playwright-e2e/data/payload/contested/caseworker/general-application-outcome/outcome-is-other.json",
    generalApplicationOldHearingRequiredYes: "./playwright-e2e/data/payload/contested/caseworker/general-application-directions/old-style-hearing-required-yes.json",
    listForHearingFdaEgOne: "./playwright-e2e/data/payload/contested/caseworker/list-for-hearing/fda-example-one.json",
    judiciaryBasicApproveOrders: "./playwright-e2e/data/payload/contested/judiciary/most-basic-approve-orders.json",
    processOrderBasicTwoHearing: "./playwright-e2e/data/payload/contested/caseworker/process-order/basic-two-hearing.json",
    createFlag: "./playwright-e2e/data/payload/consented/caseworker/create-flag.json"
  }
} as const;
