export enum CaseType {
  Consented = "FinancialRemedyMVP2",
  Contested = "FinancialRemedyContested",
}

export enum UserType {
  Solicitor = "solicitor",
  Caseworker = "caseworker",
}

export const PayloadPath = {
  Consented: {
    base: "./playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json",
    createFlag: "./playwright-e2e/data/payload/consented/caseworker/create-flag.json",
  },
  Contested: {
    base: "./playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json",
    formA: "./playwright-e2e/data/payload/contested/forma/ccd-contested-base.json",
    formASubmit: "./playwright-e2e/data/payload/contested/solicitor/case-submission.json",
    paper: "./playwright-e2e/data/payload/contested/paper_case/ccd-contested-base.json",
    hwfPayment: "./playwright-e2e/data/payload/contested/caseworker/HWF-payment.json",
    hwfDecisionMade: "./playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json",
    manualPayment: "./playwright-e2e/data/payload/contested/caseworker/manual-payment.json",
    issueApplication: "./playwright-e2e/data/payload/contested/caseworker/issue-application.json",
    refugePaperCase: "./playwright-e2e/data/payload/contested/paper_case/ccd-contested-refuge-applicant.json",
    progressToListing: "./playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json",
  }
} as const;
