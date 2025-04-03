export interface CaseEvent {
    listItem: string;
    ccdCallback: string;
}

export const consentedEvents: Record<string, CaseEvent> = {
    CreateCase: {
        listItem: "Consent Order Application",
        ccdCallback: "FR_solicitorCreate"
    },
    ApplicationPaymentSubmission: {
        listItem: "Case Submission",
        ccdCallback: "FR_applicationPaymentSubmission"
    },
    HwfPaymentSubmission: {
        listItem: "HWF Application Accepted",
        ccdCallback: "FR_HWFDecisionMade"
    },
    IssueApplication: {
        listItem: "Issue Application",
        ccdCallback: "FR_issueApplication"
    },
    ApproveApplication: {
        listItem: "Approve Application",
        ccdCallback: "FR_approveApplication"
    },
    SendOrder: {
        listItem: "Send Order",
        ccdCallback: "FR_sendOrderForApproved"
    },
    UpdateContactDetails: {
        listItem: "Update contact details",
        ccdCallback: "FR_updateContactDetails"
    }
};

export const contestedEvents: Record<string, CaseEvent> = {
    CreateCase: {
        listItem: "Form A Application",
        ccdCallback: "FR_solicitorCreate"
    },
    CreatePaperCase: {
        listItem: "Paper Case",
        ccdCallback: "FR_newPaperCase"
    },
    ApplicationPaymentSubmission: {
        listItem: "Case Submission",
        ccdCallback: "FR_applicationPaymentSubmission"
    },
    progressToListing: {
        listItem: "Progress to Listing",
        ccdCallback: "FR_progressToSchedulingAndListing"
    },
    listForHearing: {
        listItem: "List for Hearing",
        ccdCallback: "FR_addSchedulingListingInfo"
    },
    manageExpressCase: {
       listItem: "Manage Express Case",
       ccdCallback: "FR_manageExpressCase"
    },
    giveAllocationDirection: {
       listItem: "Give Allocation Directions",
       ccdCallback: "FR_giveAllocationDirections"
    },
    amendApplicationDetails: {
       listItem: "Amend Application Details",
       ccdCallback: "FR_amendPaperApplication"
    }
};
