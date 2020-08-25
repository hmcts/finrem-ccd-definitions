
// in this file you can append custom step methods to 'I' object

const { miamCertification } = require('./pages/contested-pages/miam-certification');
const { mediationQuestion } = require('./pages/contested-pages/mediation-questions');
const { applyingToCourt } = require('./pages/contested-pages/apply-court');
const { complexityList } = require('./pages/contested-pages/complexity-list');
const { fastTrack } = require('./pages/contested-pages/fast-track');
const { finalPaymentSubmissionPage } = require('./pages/final-payment-submission-page/final-payment-submission-page');
const { paymentSubmission } = require('./pages/payment-submission/payment-submisison');
const { hwfPaymentDetails } = require('./pages/hwf-payment-details/hwf-payment-detail');
const { paymentPage } = require('./pages/payment-page/payment-page');
const { caseSubmitAuthorisation } = require('./pages/case-authorisation/case-authorisation');
const { amendApplicationDetails, contestedAmendApplicationDetails } = require('./pages/amend-application-details/amend-application-details');
const { checkYourAnswers, contestedCheckYourAnswers } = require('./pages/check-your-answers/check-your-answers');
const { savingApplicationInformation, finalInformationPage } = require('./pages/saving-application-information/saving-application-information');
const { optionalDocuments, consentedOtherDocuments, contestedOtherDocuments } = require('./pages/optional-documents/optional-documents');
const { d81Question } = require('./pages/d81-question/d81-question');
const { consentOrder } = require('./pages/consent-order/consent-order');
const { orderForChildren, contestedOrderForChildren } = require('./pages/order-for-children/order-for-children');
const { natureOfApplication, contestedNatureOfApplication } = require('./pages/nature-of-application/nature-of-application');
const { consentedRespondentDetails, contestedRespondentDetails } = require('./pages/respondent-details/respondent-details');
const { applicantDetails, contestedApplicantDetails } = require('./pages/applicant-details/applicant-details');
const { solicitorCreate, contestedSolicitorCreate } = require('./pages/solicitor-create/solicitor-create');
const { divorceDetails, contestedDivorceDetails } = require('./pages/divorce-details/divorce-details');
const { waitForContinueButtonEnabled } = require('./pages/common/common');
const { waitForPage } = require('./pages/common/common');
const { createCase } = require('./pages/create-case/create-case');
const { historyTab, applicantTab, respondentTab, divorceTab, natureOfApplicationTab, authorisationTab, caseDocumentsTab, paymentDetailsTab, judgeDetailsTab, adminNotesTab, gateKeepingAllocationsTab, schedulingAndListingTab, consentOrderProcessTab, verifyConsentedTabData, verifyContestedTabData, verifyContestedPaperTabData } = require('./pages/tab-data-verification/tab-data-verification');


module.exports = () => {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    loginToAdminConsole() {
      this.amOnPage(`${process.env.CCD_ADMIN_URL}`);
      this.see('Sign in');
      this.fillField('username', 'ccd-importer@server.net');
      this.fillField('password', 'Password12');
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
      this.wait('5');
      this.waitForText('Email address');
      this.fillField('username', username);
      this.fillField('password', password);
      this.click('Sign in');
      this.wait('15');
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
    gateKeepingAllocationsTab,
    schedulingAndListingTab,
    consentOrderProcessTab,
    verifyConsentedTabData,
    verifyContestedTabData,
    verifyContestedPaperTabData
  });
};
