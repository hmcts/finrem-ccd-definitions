const { createCaseInCcd, updateCaseInCcd, createSolicitorReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;

Feature('create Contested case ');

Scenario('Contested Case Creation For Caseworker @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    // TO-DO -Verify data , if needed manual/automate update, state change testing
  }
});

Scenario('Contested Case Creation For Judge @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // TO-DO -Verify data , if needed manual/automate update, state change testing
  }
});

Scenario('Consented case in Contested @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const contestToConsent = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_consentOrder', './test/data/ccd-contested-to-consented.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    // TO-DO -Verify data , if needed manual/automate update, state change testing
  }
});

Scenario('Consented case in Contested Assigned to Judge@nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const contestToConsent = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_consentOrder', './test/data/ccd-contested-to-consented.json');
  const contestAssignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_assignToJudgeConsent', './test/data/ccd-contested-to-consented.json');

  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    // TO-DO -Verify data , if needed manual/automate update, state change testing
  }
});

/* eslint-disable require-await */
Scenario('Contested Case Creation by Solicitor @nightly', async I => {
  if (nightlyTest === 'true') {
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.wait('10');
    I.click('Continue on this URL');
    I.wait('2');
    I.createCase('FinancialRemedyContested', 'Form A Application');
    I.contestedSolicitorCreate(solRef);
    I.contestedDivorceDetails();
    I.contestedApplicantDetails();
    I.contestedRespondentDetails();
    I.contestedNatureOfApplication();
    I.contestedOrderForChildren();
    I.fastTrack();
    I.complexityList();
    I.applyingToCourt();
    I.mediationQuestion();
    I.miamCertification();
    I.contestedOtherDocuments();
    I.contestedCheckYourAnswers();
    I.see('Form A Application');
    I.contestedAmendApplicationDetails();
    I.caseSubmitAuthorisation('contested');
    I.paymentPage(false);
    I.hwfPaymentDetails();
    I.paymentSubmission();
    I.savingApplicationInformation();
    I.finalPaymentSubmissionPage();
    I.finalInformationPage();
    I.see('Case Submission');
    // To-do Tab data verification.
    // eslint-disable-next-line max-len
    I.historyTab(verifyTabText.caseType, verifyTabText.historyTab.tabName, verifyTabText.historyTab.caseSubmissionEvent, verifyTabText.historyTab.hwfCaseSubmissionEndState);
    I.applicantTab(verifyTabText.caseType, verifyTabText.applicantTab.tabName);
    I.respondentTab(verifyTabText.caseType, verifyTabText.respondentTab.tabName);
    I.divorceTab(verifyTabText.caseType, verifyTabText.divorceTab.tabName);
    I.natureOfApplicationTab(verifyTabText.caseType, verifyTabText.natureOfApplicationTab.tabName);
    I.authorisationTab(verifyTabText.caseType, verifyTabText.authorisationTab.tabName);
    I.caseDocumentsTab(verifyTabText.caseType, verifyTabText.caseDocumentsTab.tabName);
    I.paymentDetailsTab(verifyTabText.caseType, verifyTabText.paymentDetailsTab.tabName);
    I.gateKeepingAllocationsTab(verifyTabText.caseType, verifyTabText.gateKeepingAllocationsTab.tabName);
    I.schedulingAndListingTab(verifyTabText.caseType, verifyTabText.schedulingAndListingTab.tabName);
  }
});
