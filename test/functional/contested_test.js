const { createCaseInCcd, updateCaseInCcd, createSolicitorReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../data/verify-contested-paper-case-tab-data.json');

// eslint-disable max-len

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;
const runningEnv = process.env.RUNNING_ENV;

Feature('create Contested case ');

Scenario('Contested Case Creation For Caseworker @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    /* eslint-disable */
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-demo-contested-basic-data.json');
  } else {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.hwfPaymentAcceptedEvent, verifyTabText.historyTab.hwfPaymentAcceptedEndState);
    }
  }
});

Scenario('Contested Case Creation For Judge @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    /* eslint-disable */
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-demo-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
  } else {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
    /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.assignToJudgeEvent, verifyTabText.historyTab.assignToJudgeEndState);
      I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
    }
  }
});

Scenario('Consented case in Contested @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    /* eslint-disable */
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-demo-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const contestToConsent = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_consentOrder', './test/data/ccd-demo-contested-to-consented.json');
  } else {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const contestToConsent = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_consentOrder', './test/data/ccd-contested-to-consented.json');
    /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.consentOrderEvent, verifyTabText.historyTab.consentOrderEndState);
      I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
      I.consentOrderProcessTab(verifyTabText.caseType, verifyTabText.consentOrderProcessTab.tabName);
    }
  }
});

Scenario('Consented case in Contested Assigned to Judge@nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
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
    // eslint-disable-next-line max-len
    I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.assignToJudgeConsentEvent, verifyTabText.historyTab.assignToJudgeConsentEndState);
    I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
    I.consentOrderProcessTab(verifyTabText.caseType, verifyTabText.consentOrderProcessTab.tabName);
  }
});

Scenario('Contested Paper Case Creation @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(caseWorkerUserName, caseWorkerPassword, './test/data/ccd-demo-contested-paper-case-basic-data.json', 'FinancialRemedyContested', 'FR_newPaperCase');
    /* eslint-disable */
    const manualPayment = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_manualPayment', './test/data/ccd-demo-contested-paper-case-basic-data.json');

  } else {
    const caseId = await createCaseInCcd(caseWorkerUserName, caseWorkerPassword, './test/data/ccd-contested-paper-case-basic-data.json', 'FinancialRemedyContested', 'FR_newPaperCase');
    const manualPayment = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_manualPayment', './test/data/ccd-contested-paper-case-basic-data.json');
    /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyContestedPaperTabData(verifyContestedPaperTabText.caseType, verifyContestedPaperTabText.historyTab.manualPaymentEvent, verifyContestedPaperTabText.historyTab.manualPaymentEndState);
    }
  }
});

Scenario('Contested case with General Application @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const createGeneralApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_createGeneralApplication', './test/data/ccd-contested-general-applicaition.json');
  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // eslint-disable-next-line max-len
    I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.createGeneralApplicationEvent, verifyTabText.historyTab.createGeneralApplicationState);
    I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
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
    // Tab data verification.
    // eslint-disable-next-line max-len
    I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.caseSubmissionEvent, verifyTabText.historyTab.hwfCaseSubmissionEndState);
  }
});
