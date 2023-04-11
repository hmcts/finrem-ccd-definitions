const { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../data/verify-contested-paper-case-tab-data.json');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('helpers/utils.js');

// eslint-disable max-len

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;
const caRef= `AUTO-${createCaseworkerReference()}`;
let caseRef;

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
  // if (runningEnv === 'demo') {
  //   const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-demo-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  //   /* eslint-disable */
  //   const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  //   const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-demo-contested-basic-data.json');
  //   const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  //   const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
  // } else {
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
   // }
  }
});

Scenario('Contested Case Creation For Ready For Hearing @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
  const allocationDirections = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyContested', 'FR_giveAllocationDirections', './test/data/ccd-contested-allocation-directions.json');
  const listForHearing = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_addSchedulingListingInfo', './test/data/ccd-contested-list-for-hearing.json');
  const submitUploadCaseFiles = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_submitUploadedCaseFiles', './test/data/ccd-contested-list-for-hearing.json');

  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // eslint-disable-next-line max-len
    I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.submitUploadCaseFilesEvent, verifyTabText.historyTab.submitUploadCaseFilesEndState);
    I.schedulingAndListingTab(verifyTabText.caseType, verifyTabText.schedulingAndListingTab.tabName);
    I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
  }
});
Scenario('Contested Case Approved and Send Order  @nightly @pipeline', async I => {
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  /* eslint-disable */
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
  const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
  const allocationDirections = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyContested', 'FR_giveAllocationDirections', './test/data/ccd-contested-allocation-directions.json');
  const listForHearing = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_addSchedulingListingInfo', './test/data/ccd-contested-list-for-hearing.json');
  const submitUploadCaseFiles = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_submitUploadedCaseFiles', './test/data/ccd-contested-list-for-hearing.json');
  const solicitorDraftDirectionOrder = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_solicitorDraftDirectionOrder', './test/data/ccd-contested-solicitor-draft-direction-order.json');
  const draftOrderApproved = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyContested', 'FR_draftOrderApproved', './test/data/ccd-contested-judge-approved.json');
  const uploadOrder = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_directionOrder', './test/data/ccd-contested-caseworker-upload-order.json');
  const sendOrder = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_sendOrder', './test/data/ccd-caseworker-send-order.json');

  /* eslint-enable */
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    // eslint-disable-next-line max-len
    I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.sendOrderEvent, verifyTabText.historyTab.sendOrderState);
    I.wait(2);
    I.click({css: '.mat-tab-header-pagination-after'});
    I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
    I.contestedOrderTab(verifyTabText.caseType, verifyTabText.OrdersTab.tabName);
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

Scenario('Consented case in Contested Assigned to Judge @nightly @pipeline', async I => {
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

// Scenario('Contested case with General Application @nightly @pipeline', async I => {
//   const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
//   /* eslint-disable */
//   const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
//   const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
//   const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
//   const createGeneralApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_createGeneralApplication', './test/data/ccd-contested-general-applicaition.json');
//   /* eslint-enable */
//   if (nightlyTest === 'true') {
//     I.signInIdam(caseWorkerUserName, caseWorkerPassword);
//     I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
//     // eslint-disable-next-line max-len
//     I.verifyContestedTabData(verifyTabText.caseType, verifyTabText.historyTab.createGeneralApplicationEvent, verifyTabText.historyTab.createGeneralApplicationState);
//     I.adminNotesTab(verifyTabText.caseType, verifyTabText.adminNotesTab.tabName);
//   }
// });


Scenario('Contested share case @nightly @pipeline', async I => {
  if (nightlyTest === 'true') {
    /* eslint-disable */
  const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
  const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json',solRef);
  /* eslint-enable */
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.assignContestedShareCase(caseId, solRef);
  }
}).retry(3);


Scenario('Contested Matrimonial Case Creation by Solicitor @nightly @test1', async I => {
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.wait('2');
    await I.createCase('FinancialRemedyContested', 'Form A Application');
    await I.contestedSolicitorCreate(solRef, 'Matrimonial');
    await I.contestedDivorceDetails();
    await I.contestedApplicantDetails();
    await I.contestedRespondentDetails();
    await I.contestedNatureOfApplication();
    await I.fastTrack();
    await I.complexityList();
    await I.applyingToCourt();
    await I.mediationQuestion();
    await I.miamCertification();
    await I.contestedOtherDocuments();
    await I.contestedCheckYourAnswers('Matrimonial');
    I.waitForText('Form A Application', '60')
}).retry(3);

//TODO
/*Scenario('Contested Matrimonial Case Submission and amend application by Solicitor @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    if (nightlyTest === 'true') {
        await I.signInIdam(solicitorUserName, solicitorPassword);
        await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

        //amend application
        I.contestedAmendApplicationDetails();

        await I.caseSubmitAuthorisation('contested');
        await I.paymentPage(false);
        await I.hwfPaymentDetails();
        await I.paymentSubmission();
        pause();
        await I.savingApplicationInformation('contested');
        await I.finalPaymentSubmissionPage();
        await I.finalInformationPage();
        I.see('Case Submission');
    }
}).retry(3);*/



Scenario('Contested Schedule 1 Case Creation by Solicitor @nightly', async I => {
    I.signInIdam(solicitorUserName, solicitorPassword);
    I.wait('2');
    await I.createCase('FinancialRemedyContested', 'Form A Application');
    await I.contestedSolicitorCreate(solRef, 'Schedule1');
    await I.contestedApplicantDetails();
    await I.childrenDetails();
    await I.contestedRespondentDetails();
    await I.contestedNatureOfApplicationForSchedule1();
    await I.fastTrack();
    await I.complexityList();
    await I.applyingToCourt();
    await I.mediationQuestion();
    await I.miamCertification();
    await I.contestedOtherDocuments();
    await I.contestedCheckYourAnswers('Schedule1');
    I.waitForText('Form A Application', '60')
}).retry(2);

Scenario('Contested Schedule 1 Case Creation by caseworker @nightly', async I => {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.wait('2');
    await I.createCase('FinancialRemedyContested', 'Form A Application');
    await I.contestedCaseworkerCreate(caRef, 'Schedule1', true);
    await I.contestedApplicantDetails();
    await I.childrenDetails();
    await I.contestedRespondentDetails();
    await I.contestedNatureOfApplicationForSchedule1();
    await I.fastTrack();
    await I.complexityList();
    await I.applyingToCourt();
    await I.mediationQuestion();
    await I.miamCertification();
    await I.contestedOtherDocuments();
    await I.contestedCheckYourAnswers('Schedule1');
    I.waitForText('Form A Application', '60')
}).retry(2);

/*
Scenario('Contested Schedule 1 Case Creation by Solicitor using API call @nightly', async I => {
   //TODO
}).retry(2);
*/

Scenario('Contested Matrimonial Case Creation by Caseworker @nightly', async I => {
  if (nightlyTest === 'true') {
    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.wait('2');
    await I.createCase('FinancialRemedyContested', 'Form A Application');
    await I.contestedCaseworkerCreate(caRef, 'Matrimonial', true);
    await I.contestedDivorceDetails();
    await I.contestedApplicantDetails();
    await I.contestedRespondentDetails();
    await I.contestedNatureOfApplication();
    await I.fastTrack();
    await I.complexityList();
    await I.applyingToCourt();
    await I.mediationQuestion();
    await I.miamCertification();
    await I.contestedOtherDocuments();
    await I.contestedCheckYourAnswers('Matrimonial');
    I.waitForText('Form A Application', '60');
    await I.manualPayment();
    await I.issueApplication();
  }
}).retry(3);

Scenario('Upload Case Files (Confidential Documents) @nightly', async I => {
    //login as a caseworker, create contested case

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.wait('2');
    await I.createCase('FinancialRemedyContested', 'Form A Application');
    await I.contestedCaseworkerCreate(caRef, 'Matrimonial', true);
    await I.contestedDivorceDetails();
    await I.contestedApplicantDetails();
    await I.contestedRespondentDetails();
    await I.contestedNatureOfApplication();
    await I.fastTrack();
    await I.complexityList();
    await I.applyingToCourt();
    await I.mediationQuestion();
    await I.miamCertification();
    await I.contestedOtherDocuments();
    await I.contestedCheckYourAnswers('Matrimonial');
    I.waitForText('Form A Application', '60');
    await I.manualPayment();
    await I.issueApplication();
    await I.uploadCaseFiles();
    await I.verifyContestedConfidentialTabData(verifyTabText.historyTab.uploadCaseFiles, verifyTabText.confidentialDocumentsTab);
    logger.info('Confidential documents verified on Confidential documents tab');

}).retry(2);

Scenario('Manage Confidential Documents @nightly', async I => {

    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.manageConfidentialDocuments();
    logger.info('Manage confidential documents event completed');
    await I.verifyContestedConfidentialTabData(verifyTabText.historyTab.manageConfidentialDocuments, verifyTabText.confidentialDocumentsTab);
    logger.info('Confidential documents verified on Confidential documents tab');

}).retry(2);

Scenario('progress to listing for contested case @nightly', async I => {

    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    logger.info('---------------------case number------------------------', caseId);
    logger.info('--------------case worker created case ' +caseId+ ' successfully-----------------');
    await I.allocateJudge();
    await I.see('Allocate to Judge');
    await I.signOut();
    await I.signInIdam(judgeUserName, judgePassword);
    await I.waitForText('Judicial Case Manager');
    await I.enterCaseReference(caseId);
    await I.see('Gate Keeping And Allocation');
    await I.giveAllocationDirection();
    await I.signOut();
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.waitForText('Manage Cases');
    await I.enterCaseReference(caseId);
    await I.listForHearing();
     I.waitForText('List for Hearing');
}).retry(2);

Scenario('Update Contact Details for contested Case @nightly ', async I => {
  //caseworker, type-matrimonial
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.updateContactDetails();

}).retry(2);

//
// Scenario('Add Interveners @nightly', async I => {
//     const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
//     const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
//     const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
//     const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
//
//     await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
//     await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
//     I.wait('5');
//     await I.manageInterveners();
//     logger.info('Manage Interveners event completed');
//     await I.contestedIntervenersTab(verifyTabText.historyTab.manageIntervenersEvent, verifyTabText.IntervenersTab);
//     logger.info('Interveners tab verified');
// }).retry(2);

/*Scenario('Caseworker creates case flag  @nightly @pipeline', async I => {
//case type - matrimonial
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag
        //validate flag in tab
}).retry(2);*/

/*Scenario('Caseworker manage case flag  @nightly @pipeline', async I => {
//case type - matrimonial
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag (this can be done via API call too)
       //manage case flag
       //validate inactivated flag in a tab
}).retry(2);*/


/*Scenario('Judge creates case flag  @nightly @pipeline', async I => {
//case type - matrimonial
        //TODO- add API call to create case via caseworker - end state should be application drafted
        //add 1 case flag
        //validate flag in tab
}).retry(2);*/

/*Scenario('Judge manage case flag  @nightly @pipeline', async I => {
//case type - matrimonial
        //TODO- add API call to create case via caseworker- end state should be application drafted
        //add 1 case flag (this can be done via API call too)
       //manage case flag
       //validate inactivated flag in a tab
}).retry(2);*/

/*Scenario('Caseworker creates case flag  @nightly @pipeline', async I => {
//case type - schedule 1
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag
        //validate flag in tab
}).retry(2);*/

/*Scenario('Caseworker manage case flag  @nightly @pipeline', async I => {
//case type - schedule 1
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag (this can be done via API call too)
       //manage case flag
       //validate inactivated flag in a tab
}).retry(2);*/

//GA and paper case -case flag




