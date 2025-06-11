
// in this file you can append custom step methods to 'I' object

const { miamCertification } = require('./pages/contested-pages/miam-certification');
const { mediationQuestion,mediationQuestionNoMIAMYesExemption, mediationQuestionNoMIAMNoExemption } = require('./pages/contested-pages/mediation-questions');
const { applyingToCourt } = require('./pages/contested-pages/apply-court');
const { complexityList } = require('./pages/contested-pages/complexity-list');
const { fastTrack } = require('./pages/contested-pages/fast-track');
const { finalPaymentSubmissionPage } = require('./pages/final-payment-submission-page/final-payment-submission-page');
const { paymentSubmission } = require('./pages/payment-submission/payment-submisison');
const { hwfPaymentDetails } = require('./pages/hwf-payment-details/hwf-payment-detail');
const { paymentPage } = require('./pages/payment-page/payment-page');
const { caseSubmitAuthorisation } = require('./pages/case-authorisation/case-authorisation');
const { amendApplicationDetails, contestedAmendApplicationDetails } = require('./pages/amend-application-details/amend-application-details');
const { checkYourAnswers, contestedCheckYourAnswers, contestedCheckYourAnswersMIAMNotAttended } = require('./pages/check-your-answers/check-your-answers');
const { savingApplicationInformation, finalInformationPage } = require('./pages/saving-application-information/saving-application-information');
const { optionalDocuments, consentedOtherDocuments, contestedOtherDocuments, contestedOtherDocumentsPaperCase } = require('./pages/optional-documents/optional-documents');
const { d81Question } = require('./pages/d81-question/d81-question');
const { consentOrder } = require('./pages/consent-order/consent-order');
const { orderForChildren, contestedOrderForChildren } = require('./pages/order-for-children/order-for-children');
const { natureOfApplication, contestedNatureOfApplication, contestedNatureOfApplicationForSchedule1 } = require('./pages/nature-of-application/nature-of-application');
const { consentedRespondentDetails, contestedRespondentDetails } = require('./pages/respondent-details/respondent-details');
const { applicantDetails, contestedApplicantDetails } = require('./pages/applicant-details/applicant-details');
const { solicitorCreate, contestedSolicitorCreate } = require('./pages/solicitor-create/solicitor-create');
const { divorceDetails, contestedDivorceDetails } = require('./pages/divorce-details/divorce-details');
const { waitForContinueButtonEnabled } = require('./pages/common/common');
const { waitForPage } = require('./pages/common/common');
const { createCase, createPaperCase } = require('./pages/create-case/create-case');
const { historyTab, applicantTab, respondentTab, divorceTab, natureOfApplicationTab, authorisationTab, caseDocumentsTab, paymentDetailsTab, judgeDetailsTab, adminNotesTab, contestedOrderTab, approvedOrderTab, gateKeepingAllocationsTab, schedulingAndListingTab, consentOrderProcessTab, verifyConsentedTabData, verifyContestedTabData, verifyContestedPaperTabData, verifyContestedConfidentialTabData, contestedIntervenersTab, schedule1Tab, changeOfRepresentativesTab, verifyManageBarristerEvent, verifyListForInterimHearing, verifyCaseFlagEvent, verifyGeneralApplicationTab} = require('./pages/tab-data-verification/tab-data-verification');
const { assignContestedShareCase } = require('./pages/share-case-in-org/share-case-in-org');
const {contestedCaseworkerCreate, contestedCaseworkerCreatePaperCase} = require('./pages/caseworker-create/caseworker-create');
const {pbaPayment} = require('./pages/pba-payment/pba-payment');
const {manualPayment} = require('./pages/manual-payment/manual-payment');
const {issueApplication, getCaseRefFromScreen} = require('./pages/issue-application/issue-application');
const {childrenDetails} = require('./pages/children-details/children-details');
const {allocateJudge} = require('./pages/allocate-judge/allocate-judge');
const {uploadCaseFiles} = require('./pages/upload-case-files/upload-case-files');
const {progressToListing} = require('./pages/progress-to-listing/progress-to-listing');
const {listForHearing} = require('./pages/list-for-hearing/list-for-hearing');
const {enterCaseReference} = require('./pages/enter-case-reference/enter-case-reference');
const {giveAllocationDirection} = require('./pages/give-allocation-direction/give-allocation-direction');
const {updateContactDetails} = require('./pages/update-contact-details/update-contact-details');
const {manageIntervenersAdd} = require('./pages/manage-interveners/manage-interveners-add');
const {manageIntervenersRemove} = require('./pages/manage-interveners/manage-interveners-remove');
const {addNote} = require('./pages/add-note/add-note');
const {refundCase} = require('./pages/refund-case/refund-case');
const {uploadDraftOrder} = require('./pages/upload-draft-order/upload-draft-order');
const {draftOrderApprove} = require('./pages/draft-order-approve/draft-order-approve');
const {uploadOrder} = require('./pages/upload-order/upload-order');
const {sendOrder,sendOrderNew} = require('./pages/send-order/send-order');
const {listForInterimHearing} = require('./pages/list-of-interim-hearing/list-of-interim-hearing');
const {createCaseFlag, validateCaseFlagAlertMessage, validateCaseFlagTab} = require('./pages/create-case-flag/create-case-flag');
const {manageBarristerApplicant, manageBarristerRespondent} = require('./pages/manage-barrister/manage-barrister');
const {solicitorCreateGeneralApplication, caseWorkerReferGeneralApplication, judgeGeneralApplicationOutcome, generalApplicationDirections} = require('./pages/general-application/general-application');
const {manageFlags} = require('./pages/manage-flags/manage-case-flags');
const crossBrowser = process.env.TESTS_FOR_CROSS_BROWSER || 'false';
const adminUserName = process.env.CCD_ADMIN_USER_NAME
const adminPassword = process.env.CCD_ADMIN_PASSWORD
module.exports = () => {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

    loginToAdminConsole() {
      this.amOnPage(`${process.env.CCD_ADMIN_URL}`);
      this.see('Sign in');
      this.fillField('username', adminUserName);
      this.fillField('password', adminPassword);
      this.click('Sign in');
      this.see('Welcome to CCD Admin Web');
    },

    createRole(role) {
      this.click('Manage User Roles');
      this.click('Create User Role');
      this.fillField('role', role);
      this.click('Create');
    },

    uploadConfig(path) {
      this.click('Import Case Definition');
      this.attachFile('file', path);
      this.click('Submit');
    },

    signInIdam(username, password) {
      this.amOnPage(`${process.env.CCD_WEB_URL}`);
      this.acceptCookies();
      this.refreshPage();
      this.fillField('username', username);
      this.fillField('password', password);
      this.click('Sign in');
      this.acceptCookies();
      this.refreshPage();
    },

    signOut() {
      this.click('Sign out');
    },

    signInXuiOrg(username, password) {
      this.amOnPage(`${process.env.XUI_ORG_WEB_URL}`);
      this.fillField('username', username);
      this.fillField('password', password);
      this.click('Sign in');
    },

    acceptCookies() {
      tryTo(() => this.click('Accept additional cookies'));
      tryTo(() => this.click('Accept analytics cookies'));
      tryTo(() => this.click('Hide this message'));
    },

    createCase,
    waitForPage,
    waitForContinueButtonEnabled,
    solicitorCreate,
    contestedSolicitorCreate,
    divorceDetails,
    contestedDivorceDetails,
    applicantDetails,
    contestedApplicantDetails,
    consentedRespondentDetails,
    contestedRespondentDetails,
    natureOfApplication,
    contestedNatureOfApplication,
    orderForChildren,
    contestedOrderForChildren,
    fastTrack,
    complexityList,
    applyingToCourt,
    mediationQuestion,
    mediationQuestionNoMIAMYesExemption,
    miamCertification,
    consentOrder,
    d81Question,
    optionalDocuments,
    consentedOtherDocuments,
    contestedOtherDocuments,
    savingApplicationInformation,
    finalInformationPage,
    checkYourAnswers,
    contestedCheckYourAnswers,
    amendApplicationDetails,
    contestedAmendApplicationDetails,
    caseSubmitAuthorisation,
    paymentPage,
    hwfPaymentDetails,
    paymentSubmission,
    finalPaymentSubmissionPage,
    historyTab,
    applicantTab,
    respondentTab,
    divorceTab,
    natureOfApplicationTab,
    authorisationTab,
    caseDocumentsTab,
    paymentDetailsTab,
    judgeDetailsTab,
    adminNotesTab,
    contestedOrderTab,
    approvedOrderTab,
    gateKeepingAllocationsTab,
    schedulingAndListingTab,
    consentOrderProcessTab,
    verifyConsentedTabData,
    verifyContestedTabData,
    verifyContestedPaperTabData,
    assignContestedShareCase,
    contestedCaseworkerCreate,
    pbaPayment,
    manualPayment,
    issueApplication,
    childrenDetails,
    contestedNatureOfApplicationForSchedule1,
    allocateJudge,
    uploadCaseFiles,
    verifyContestedConfidentialTabData,
    progressToListing,
    listForHearing,
    getCaseRefFromScreen,
    enterCaseReference,
    giveAllocationDirection,
    updateContactDetails,
    manageIntervenersAdd,
    manageIntervenersRemove,
    contestedIntervenersTab,
    refundCase,
    addNote,
    manageBarristerApplicant,
    manageBarristerRespondent,
    schedule1Tab,
    changeOfRepresentativesTab,
    verifyManageBarristerEvent,
    uploadDraftOrder,
    draftOrderApprove,
    uploadOrder,
    sendOrder,
    sendOrderNew,
    listForInterimHearing,
    verifyListForInterimHearing,
    createCaseFlag,
    validateCaseFlagAlertMessage,
    validateCaseFlagTab,
    verifyCaseFlagEvent,
    solicitorCreateGeneralApplication,
    verifyGeneralApplicationTab,
    caseWorkerReferGeneralApplication,
    judgeGeneralApplicationOutcome,
    generalApplicationDirections,
    manageFlags,
    contestedCheckYourAnswersMIAMNotAttended,
    createPaperCase,
    contestedOtherDocumentsPaperCase,
    contestedCaseworkerCreatePaperCase,
    mediationQuestionNoMIAMNoExemption
  });
};
