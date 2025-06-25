const { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('helpers/utils.js');

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const runningEnv = process.env.RUNNING_ENV;

Feature('Contested Events Tests');

Scenario('Contested Manage Barrister @nightly', async ({ I }) => {
    //Matrimonial
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('20');
    await I.manageBarristerApplicant();
    I.wait('5');
    await I.manageBarristerRespondent();
    await I.verifyManageBarristerEvent(verifyTabText.caseType, verifyTabText.historyTab.manageBarristerEvent, verifyTabText.historyTab.issueApplicationEndState);
    await I.clickTab('Change of representatives');
    await I.waitForText('FinRem-1-Org', 30);
    await I.changeOfRepresentativesTab(verifyTabText.historyTab.manageBarristerEvent);
    logger.info("manage barrister tab verified...");
}).retry(3);

Scenario('List for hearing contested case @nightly', async ({ I }) => {

    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    logger.info('---------------------case number------------------------', caseId);
    await I.allocateJudge();
    I.wait('10');
    await I.see('Allocate to Judge');
    await I.signOut();
    await I.signInIdam(judgeUserName, judgePassword);
    I.wait('15');
    await I.waitForText('Judicial Case Manager');
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('10');
    await I.see('Gate Keeping And Allocation');
    await I.giveAllocationDirection();
    I.wait('15');
    await I.signOut();
    I.wait('10');
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.wait('15');
    await I.waitForText('Manage Cases');
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`)
    I.wait('10');
    await I.listForHearing();
    I.waitForText('List for Hearing');
}).retry(3);

Scenario.skip('Contested E2E @nightly @preview', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
    const allocationDirections = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyContested', 'FR_giveAllocationDirections', './test/data/ccd-contested-allocation-directions.json');
    const listForHearing = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_addSchedulingListingInfo', './test/data/ccd-contested-list-for-hearing.json');

    await I.retry(3).signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.uploadDraftOrder();
    await I.signOut();
    await I.retry(3).signInIdam(judgeUserName, judgePassword);
    await I.waitForText('Judicial Case Manager');
    await I.enterCaseReference(caseId);
    await I.waitForText('Upload Draft Order');
    await I.draftOrderApprove();
    await I.signOut();
    await I.retry(3).signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.waitForText('Manage Cases');
    await I.enterCaseReference(caseId);
    await I.uploadOrder();
    await I.sendOrder();
    logger.info('-----------completed E2E contested test for -------------', caseId);
}).retry(3);

Scenario.skip('Send order to an applicant solicitor @nightly', async I => {

    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const addIntervener = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'manageInterveners', 'test/data/ccd-contested-add-represented-intervener.json');
    const createGeneralOrder = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'FR_generalOrder', 'test/data/ccd-contested-create-general-order.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.sendOrderNew();
    // validate Order tab


}).retry(3);
