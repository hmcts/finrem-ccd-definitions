const { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../data/verify-contested-paper-case-tab-data.json');
const { Logger } = require('@hmcts/nodejs-logging');
const { log } = require('node:console');
const logger = Logger.getLogger('helpers/utils.js');


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
const runningEnv = process.env.RUNNING_ENV;

Feature('Contested Case Flag Tests');

Scenario('Caseworker creates case flag @nightly', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.createCaseFlag();
    await I.verifyCaseFlagEvent(verifyTabText.caseType, verifyTabText.historyTab.createCaseFlagEvent, verifyTabText.historyTab.caseSubmissionEvent);
    await I.validateCaseFlagAlertMessage();
    await I.validateCaseFlagTab('Active');
    logger.info('case flag created and verified');
}).retry(3);

Scenario('Caseworker manage case flag @nightly', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const caseFlag = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyMVP2', 'createFlags', './test/data/ccd-consented-case-flag-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    const flagStatus = await I.manageFlags();
    await I.clickTab('Case Flags');
    await I.validateCaseFlagTab(flagStatus);
    logger.info('manage case event completed and verified');
}).retry(3);


Scenario('Judge creates case flag @nightly', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');

    await I.signInIdam(judgeUserName, judgePassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.createCaseFlag();
    await I.verifyCaseFlagEvent(verifyTabText.caseType, verifyTabText.historyTab.createCaseFlagEvent, verifyTabText.historyTab.caseSubmissionEvent);
    await I.validateCaseFlagAlertMessage();
    await I.validateCaseFlagTab('Active');
    logger.info('case flag created and verified');
}).retry(3);


Scenario('Caseworker creates case flag for schedule 1 case @nightly', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-schedule1-solicitor-create-case.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.createCaseFlag();
    await I.verifyCaseFlagEvent(verifyTabText.caseType, verifyTabText.historyTab.createCaseFlagEvent, verifyTabText.historyTab.caseSubmissionEvent);
    await I.validateCaseFlagAlertMessage();
    await I.validateCaseFlagTab('Active');
    logger.info('case flag created and verified for schedule 1 case');
}).retry(3);

Scenario.skip('Create case flag with General Application @nightly', async ({ I }) => {
    //Something is wrong with the below API calls
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const createGeneralApplication = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'createGeneralApplication', './test/data/ccd-contested-general-application-data.json');
    const referToJudgeApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_generalApplicationReferToJudge', './test/data/ccd-contested-general-application-refer-to-judge-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.createCaseFlag();
    await I.verifyCaseFlagEvent(verifyTabText.caseType, verifyTabText.historyTab.createCaseFlagEvent, verifyTabText.historyTab.awaitingJudiciaryResponseEndState);
    await I.validateCaseFlagAlertMessage();
    await I.validateCaseFlagTab('Active');
    logger.info('case flag created and verified for schedule 1 case');
}).retry(3);

// Should work after fix is merged https://github.com/hmcts/finrem-ccd-definitions/pull/2374
Scenario('Case flag for Paper Case @nightly', async ({ I }) => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-paper-case-basic-data.json', 'FinancialRemedyContested', 'FR_newPaperCase');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('15');
    await I.createCaseFlag();
    await I.verifyCaseFlagEvent(verifyTabText.caseType, verifyTabText.historyTab.createCaseFlagEvent, verifyTabText.historyTab.caseSubmissionEvent);
    await I.validateCaseFlagAlertMessage();
    await I.validateCaseFlagTab('Active');
    logger.info('case flag created and verified');
}).retry(3);
