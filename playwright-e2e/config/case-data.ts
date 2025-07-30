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
  addNotes: {
    listItem: "Add Note",
    ccdCallback: "FR_caseNotes"
  },
  closeCase: {
    listItem: "Close Case",
    ccdCallback: "FR_close"
  }
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
  issueApplication: CommonEvents.issueApplication,
  addNotes: CommonEvents.addNotes
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
    listItem: "Refer to Judge (Application)",
    ccdCallback: "FR_generalApplicationReferToJudge"
  },
  generalApplicationOutcome: {
    listItem: "General Application Outcome",
    ccdCallback: "FR_GeneralApplicationOutcome"
  },
  approveOrders: {
    listItem: "Approve orders",
    ccdCallback: "FR_approveOrders"
  },
  directionOrder: {
    listItem: "Process Order",
    ccdCallback: "FR_directionOrder"
  },
  processOrder: {
    listItem: "Process Order (MH)",
    ccdCallback: "FR_processOrder"
  },
  manageHearings: {
    listItem: "Manage Hearings",
    ccdCallback: "FR_manageHearings"
  },
  manageCaseDocuments: {
    listItem: "Manage case documents",
    ccdCallback: "FR_manageCaseDocuments"
  },
  updateContactDetails: {
    listItem: "Update contact details",
    ccdCallback: "FR_updateContactDetails"
  },
  refund: {
    listItem: "Refund",
    ccdCallback: "FR_refund"
  },
  manageBarrister: {
    listItem: "Manage Barrister",
    ccdCallback: "FR_manageBarrister"
  },
  prepareForHearing: {
    listItem: "Prepare For Hearing",
    ccdCallback: "FR_prepareForHearing"
  },
  createGeneralOrder: {
    listItem: "Create General Order",
    ccdCallback: "FR_generalOrder"
  },
  contestedSendOrder: {
    listItem: "Send Order",
    ccdCallback: "FR_sendOrder"
  },
  manageInterveners: {
    listItem: "Manage Interveners",
    ccdCallback: "manageInterveners"
  },
  consentOrder: {
    listItem: "Consent Order",
    ccdCallback: "FR_consentOrder"
  },
  // (non-prod) Migration events
  manageHearingsMigration: {
    listItem: "(Migration) Manage Hearings",
    ccdCallback: "FR_manageHearingsMigration"
  },
  createGeneralOrderConsent: {
    listItem: "Create General Order (consent)",
    ccdCallback: "FR_generalOrderConsent"
  },
  respondToConsentOrder: {
    listItem: "Respond to Consent Order",
    ccdCallback: "FR_respondToConsentOrder"
  },
  assignToJudgeConsent: {
    listItem: "Assign to Judge (consent)",
    ccdCallback: "FR_assignToJudgeConsent"
  },
  consentApplicationApproved: {
    listItem: "Consent Application Approved",
    ccdCallback: "FR_consentOrderApproved"
  },
  consentOrderNotApproved: {
    listItem: "Consent Order Not Approved",
    ccdCallback: "FR_consentOrderNotApproved"
  },
  sendConsentOrder: {
    listItem: "Send Order (consent)",
    ccdCallback: "FR_consentSendOrder"
  },

  // Common events
  createFlag: CommonEvents.createFlag,
  manageFlags: CommonEvents.manageFlags,
  applicationPaymentSubmission: CommonEvents.applicationPaymentSubmission,
  hwfDecisionMade: CommonEvents.hwfDecisionMade,
  issueApplication: CommonEvents.issueApplication,
  addNotes: CommonEvents.addNotes,
  closeCase: CommonEvents.closeCase
};

export const PayloadPath = {
  Consented: {
    // base case data
    base: "./playwright-e2e/resources/case_data/consented/ccd-consented-case-creation.json",

    // Payload Submissions
    applicationPaymentSubmission: "./playwright-e2e/resources/payload/consented/solicitor/case-submission.json",
    issueApplication: "./playwright-e2e/resources/payload/consented/caseworker/issue-application.json",
    createFlag: "./playwright-e2e/resources/payload/consented/caseworker/create-flag.json"
  },
  Contested: {
    // Base case data
    formA: "./playwright-e2e/resources/case_data/contested/forma/ccd-contested-base.json",
    paper: "./playwright-e2e/resources/case_data/contested/paper_case/ccd-contested-base.json",
    refugePaperCase: "./playwright-e2e/resources/case_data/contested/paper_case/ccd-contested-refuge-applicant.json",

    // Payload submissions
    formASubmit: "./playwright-e2e/resources/payload/contested/solicitor/case-submission.json",
    schedule1: "./playwright-e2e/resources/payload/contested/solicitor/schedule1-create-case.json",
    hwfPayment: "./playwright-e2e/resources/payload/contested/caseworker/HWF-payment.json",
    hwfDecisionMade: "./playwright-e2e/resources/payload/contested/caseworker/HWF-application-accepted.json",
    manualPayment: "./playwright-e2e/resources/payload/contested/caseworker/manual-payment.json",
    issueApplication: "./playwright-e2e/resources/payload/contested/caseworker/issue-application.json",
    progressToListing: "./playwright-e2e/resources/payload/contested/caseworker/progress-to-listing.json",
    generalApplicationCreate: "./playwright-e2e/resources/payload/contested/caseworker/create-general-application/sender-is-applicant.json",
    referToJudgeEmailIsNull: "./playwright-e2e/resources/payload/contested/caseworker/refer-to-judge/judge-email-is-null.json",
    generalApplicationOutcomeOther: "./playwright-e2e/resources/payload/contested/caseworker/general-application-outcome/outcome-is-other.json",
    generalApplicationOldHearingRequiredYes: "./playwright-e2e/resources/payload/contested/caseworker/general-application-directions/old-style-hearing-required-yes.json",
    listForHearingFdaEgOne: "./playwright-e2e/resources/payload/contested/caseworker/list-for-hearing/fda-example-one.json",
    judiciaryBasicApproveOrders: "./playwright-e2e/resources/payload/contested/judiciary/most-basic-approve-orders.json",
    processOrderBasicTwoHearing: "./playwright-e2e/resources/payload/contested/caseworker/process-order/basic-two-hearing.json",
    createFlag: "./playwright-e2e/resources/payload/consented/caseworker/create-flag.json",
    manageIntervenersAddApplicantInt: "./playwright-e2e/resources/payload/contested/caseworker/manage-interveners/add-applicant-intervener.json",
    manageIntervenersAddRespondentInt: "./playwright-e2e/resources/payload/contested/caseworker/manage-interveners/add-respondent-intervener.json",
    manageBarristerAddApplicantBarrister: "./playwright-e2e/resources/payload/contested/caseworker/manage-barristers/add-applicant-barrister.json",
    manageBarristerAddRespondentBarrister: "./playwright-e2e/resources/payload/contested/caseworker/manage-barristers/add-respondent-barrister.json",
    agreedDraftOrderApplicant: "./playwright-e2e/resources/payload/contested/caseworker/upload-draft-orders/agreed-draft-orders-applicant.json",
    manageHearingAddHearing: "./playwright-e2e/resources/payload/contested/caseworker/manage-hearing/add-a-hearing/add-a-hearing.json",
  }
} as const;
