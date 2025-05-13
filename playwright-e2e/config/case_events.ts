export interface CaseEvent {
  listItem: string;
  ccdCallback: string;
}

// Common events that are used in both consented and contested cases
const commonEvents = {
  applicationPaymentSubmission: {
    listItem: "Case Submission",
    ccdCallback: "FR_applicationPaymentSubmission",
  },
  hwfDecisionMade: {
    listItem: "HWF Application Accepted",
    ccdCallback: "FR_HWFDecisionMade",
  },
  issueApplication: {
    listItem: "Issue Application",
    ccdCallback: "FR_issueApplication",
  },
} satisfies Record<string, CaseEvent>;

export const consentedEvents: Record<string, CaseEvent> = {
  createCase: {
    listItem: "Consent Order Application",
    ccdCallback: "FR_solicitorCreate",
  },
  approveApplication: {
    listItem: "Approve Application",
    ccdCallback: "FR_approveApplication",
  },
  sendOrder: {
    listItem: "Send Order",
    ccdCallback: "FR_sendOrderForApproved",
  },
  updateContactDetails: {
    listItem: "Update contact details",
    ccdCallback: "FR_updateContactDetails",
  },
  // Common events that are used in both consented and contested cases
  applicationPaymentSubmission: commonEvents.applicationPaymentSubmission,
  hwfDecisionMade: commonEvents.hwfDecisionMade,
  issueApplication: commonEvents.issueApplication,
};

export const contestedEvents: Record<string, CaseEvent> = {
  createCase: {
    listItem: "Form A Application",
    ccdCallback: "FR_solicitorCreate",
  },
  createPaperCase: {
    listItem: "Paper Case",
    ccdCallback: "FR_newPaperCase",
  },
  progressToListing: {
    listItem: "Progress to Listing",
    ccdCallback: "FR_progressToSchedulingAndListing",
  },
  listForHearing: {
    listItem: "List for Hearing",
    ccdCallback: "FR_addSchedulingListingInfo",
  },
  amendFormAApplicationDetails: {
    listItem: "Amend Application Details",
    ccdCallback: "FR_amendApplication",
  },
  manageExpressCase: {
    listItem: "Manage Express Case",
    ccdCallback: "FR_manageExpressCase",
  },
  giveAllocationDirection: {
    listItem: "Give Allocation Directions",
    ccdCallback: "FR_giveAllocationDirections",
  },
  amendPaperApplicationDetails: {
    listItem: "Amend Application Details",
    ccdCallback: "FR_amendPaperApplication",
  },
  manualPayment: {
    listItem: "", // Not sure where to find this
    ccdCallback: "FR_manualPayment",
  },
  allocateToJudge: {
    listItem: "", // Not sure where to find this
    ccdCallback: "FR_allocateToJudge",
  },
  // Common events that are used in both consented and contested cases
  applicationPaymentSubmission: commonEvents.applicationPaymentSubmission,
  hwfDecisionMade: commonEvents.hwfDecisionMade,
  issueApplication: commonEvents.issueApplication,
};
