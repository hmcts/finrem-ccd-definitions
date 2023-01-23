const { createCaseInCcd, updateCaseInCcd, createSolicitorReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-consented-tab-data.json');

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const runningEnv = process.env.RUNNING_ENV;
const solRef = `AUTO-${createSolicitorReference()}`;


Feature('create Consented case ');

Scenario('Consent Case Creation For Caseworker @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    /* eslint-disable */
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-demo-consented-basic-data.json');
  } else {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    /* eslint-disable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      I.verifyConsentedTabData(verifyTabText.caseType, verifyTabText.historyTab.hwfPaymentAcceptedEvent, verifyTabText.historyTab.hwfPaymentAcceptedEndState);
      I.paymentDetailsTab(verifyTabText.caseType, verifyTabText.paymentDetailsTab.tabName);
      I.judgeDetailsTab(verifyTabText.caseType, verifyTabText.judgeDetailsTab.tabName, verifyTabText.historyTab.hwfPaymentAcceptedEvent);
    }
  }
});

Scenario('Consent Case Creation For Judge @nightly @pipeline', async I => {
  if (runningEnv === 'demo') {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    /* eslint-disable */
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-demo-consented-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
  } else {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
    /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyConsentedTabData(verifyTabText.caseType, verifyTabText.historyTab.issueApplicationEvent, verifyTabText.historyTab.issueApplicationEndState);
      I.paymentDetailsTab(verifyTabText.caseType, verifyTabText.paymentDetailsTab.tabName);
      I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
    }
  }
});

Scenario('Consent Case approve and send order  @nightly @pipeline ', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
    const approveOrder = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyMVP2', 'FR_approveApplication', './test/data/ccd-consented-judge-approve-data.json');
    const sendOrder = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'FR_sendOrderForApproved', './test/data/ccd-caseworker-send-order.json');

  /* eslint-enable */
    if (nightlyTest === 'true') {
      I.signInIdam(caseWorkerUserName, caseWorkerPassword);
      I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
      // eslint-disable-next-line max-len
      I.verifyConsentedTabData(verifyTabText.caseType, verifyTabText.historyTab.sendOrderEvent, verifyTabText.historyTab.approveSendOrderEndState);
      I.approvedOrderTab(verifyTabText.caseType, verifyTabText.approvedOrderTab.tabName);
  }
});
/* eslint-disable require-await */
Scenario('Consent Case Creation by Solicitor @crossbrowser @nightly ', async I => {
  if (nightlyTest === 'true') {
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.wait('2');
    await I.createCase('Financial Remedy Consented', 'Consent Order Application');
    await I.solicitorCreate(solRef);
    await I.divorceDetails();
    await I.applicantDetails();
    await I.consentedRespondentDetails();
    await I.natureOfApplication();
    await I.orderForChildren();
    await I.consentOrder();
    await I.d81Question();
    await I.optionalDocuments();
    await I.consentedOtherDocuments();
    await I.savingApplicationInformation('consented');
    await I.checkYourAnswers();
    // amend event
    I.amendApplicationDetails();
    // hwf payment submission
    await I.caseSubmitAuthorisation();
    await I.paymentPage(false);
    await I.hwfPaymentDetails();
    await I.paymentSubmission();
    await I.savingApplicationInformation('consented');
    await I.finalPaymentSubmissionPage();
    await I.finalInformationPage();
    I.waitForText('History', '30');
  }
}).retry(3);
