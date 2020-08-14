const { createCaseInCcd, updateCaseInCcd, createSolicitorReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-consented-tab-data.json');

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;

Feature('create Consented case ');

Scenario('Consent Case Creation For Caseworker @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // eslint-disable-next-line max-len
    I.historyTab(verifyTabText.historyTab.tabName, verifyTabText.historyTab.hwfPaymentAcceptedEvent, verifyTabText.historyTab.hwfPaymentAcceptedEndState);
    I.applicantTab(verifyTabText.applicantTab.tabName);
    I.respondentTab(verifyTabText.respondentTab.tabName);
    I.divorceTab(verifyTabText.divorceTab.tabName);
    I.natureOfApplicationTab(verifyTabText.natureOfApplicationTab.tabName);
    I.authorisationTab(verifyTabText.authorisationTab.tabName);
    I.caseDocumentsTab(verifyTabText.caseDocumentsTab.tabName);
    I.paymentDetailsTab(verifyTabText.paymentDetailsTab.tabName);
    I.judgeDetailsTab(verifyTabText.judgeDetailsTab.tabName);
  }
});

Scenario('Consent Case Creation For Judge @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // eslint-disable-next-line max-len
    I.historyTab(verifyTabText.historyTab.tabName, verifyTabText.historyTab.issueApplicationEvent, verifyTabText.historyTab.issueApplicationEndState);
    I.applicantTab(verifyTabText.applicantTab.tabName);
    I.respondentTab(verifyTabText.respondentTab.tabName);
    I.divorceTab(verifyTabText.divorceTab.tabName);
    I.natureOfApplicationTab(verifyTabText.natureOfApplicationTab.tabName);
    I.authorisationTab(verifyTabText.authorisationTab.tabName);
    I.caseDocumentsTab(verifyTabText.caseDocumentsTab.tabName, verifyTabText.historyTab.issueApplicationEvent);
    I.paymentDetailsTab(verifyTabText.paymentDetailsTab.tabName);
    I.judgeDetailsTab(verifyTabText.judgeDetailsTab.tabName, verifyTabText.historyTab.issueApplicationEvent);
    I.adminNotesTab(verifyTabText.adminNotesTab.tabName);
  }
});
/* eslint-disable require-await */
Scenario('Consent Case Creation by Solicitor @nightly', async I => {
  if (nightlyTest === 'true') {
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.wait('2');
    I.click('Continue on this URL');
    I.wait('2');
    I.createCase('FinancialRemedyMVP2', 'Consent Order Application');
    I.solicitorCreate(solRef);
    I.divorceDetails();
    I.applicantDetails();
    I.consentedRespondentDetails();
    I.natureOfApplication();
    I.orderForChildren();
    I.consentOrder();
    I.d81Question();
    I.optionalDocuments();
    I.consentedOtherDocuments();
    I.savingApplicationInformation();
    I.checkYourAnswers();
    I.see('Consent Order Application');
    // amend event
    I.amendApplicationDetails();
    // hwf payment submission
    I.consentedAuthorisation();
    I.paymentPage(false);
    I.hwfPaymentDetails();
    I.paymentSubmission();
    I.savingApplicationInformation();
    I.finalPaymentSubmissionPage();
    I.finalInformationPage();
    I.see('Case Submission');
    // Tab data verification.
    // eslint-disable-next-line max-len
    I.historyTab(verifyTabText.historyTab.tabName, verifyTabText.historyTab.caseSubmissionEvent, verifyTabText.historyTab.hwfCaseSubmissionEndState);
    I.applicantTab(verifyTabText.applicantTab.tabName);
    I.respondentTab(verifyTabText.respondentTab.tabName);
    I.divorceTab(verifyTabText.divorceTab.tabName);
    I.natureOfApplicationTab(verifyTabText.natureOfApplicationTab.tabName);
    I.authorisationTab(verifyTabText.authorisationTab.tabName);
    I.caseDocumentsTab(verifyTabText.caseDocumentsTab.tabName);
    I.paymentDetailsTab(verifyTabText.paymentDetailsTab.tabName);
    I.judgeDetailsTab(verifyTabText.judgeDetailsTab.tabName);
  }
});
