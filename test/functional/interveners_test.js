const { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const verifyContestedPaperTabText = require('../data/verify-contested-paper-case-tab-data.json');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('helpers/utils.js');


const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const usernameSolicitor1 = process.env.USERNAME_SOLICITOR1;
const passwordSolicitor1 = process.env.PASSWORD_SOLICITOR1;
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;
const caRef= `AUTO-${createCaseworkerReference()}`;
const runningEnv = process.env.RUNNING_ENV;

Feature('Manage Interveners');

Scenario('Add Interveners (represented) @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('5');
    await I.manageIntervenersAdd('represented');
    logger.info('Manage Interveners event completed');
    await I.contestedIntervenersTab(verifyTabText.historyTab.manageIntervenersEvent, verifyTabText.IntervenersTab);
    logger.info('Interveners tab verified');
}).retry(3);

Scenario('Add Interveners (not represented) @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('5');
    await I.manageIntervenersAdd('notRepresented');
    logger.info('Manage Interveners event completed');
}).retry(3);

Scenario('Remove Interveners @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const addIntervener = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'manageInterveners', 'test/data/ccd-contested-add-intervener.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('5');
    await I.manageIntervenersRemove();

}).retry(3);



Scenario('Case document tab not visible for Intervener solicitor @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const addIntervenerRepresented = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'manageInterveners', 'test/data/ccd-contested-add-represented-intervener.json');

    //Intervener login
    await I.signInIdam(usernameSolicitor1, passwordSolicitor1);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('5');

    //Validate no case document tab
    const context = await I.grabTextFrom({xpath:'/html/body/exui-root/exui-case-home/div/exui-case-details-home/exui-case-viewer-container/ccd-case-viewer/div/ccd-case-full-access-view/div[2]/div/mat-tab-group/mat-tab-header'});
    I.assertNotContain("Case documents", context, "Intervener tab validation failed...");
    logger.info("Intervener tab validation completed");
}).retry(3);

Scenario('FDR document tab not visible for Intervener solicitor @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const addIntervenerRepresented = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'manageInterveners', 'test/data/ccd-contested-add-represented-intervener.json');
    const uploadCaseFiles = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId,'FinancialRemedyContested', 'FR_uploadCaseFiles', 'test/data/ccd-contested-upload-case-files.json');

    //Intervener login
    await I.signInIdam(usernameSolicitor1, passwordSolicitor1);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    I.wait('5');
    //no FDR document tab
    const context = await I.grabTextFrom({xpath:'/html/body/exui-root/exui-case-home/div/exui-case-details-home/exui-case-viewer-container/ccd-case-viewer/div/ccd-case-full-access-view/div[2]/div/mat-tab-group/mat-tab-header'});
    I.assertNotContain("FDR documents", context, "Intervener tab validation failed...");
    logger.info("Intervener tab validation completed");
}).retry(3);

Scenario('Order tab not visible for Intervener solicitor', async I => {
}).retry(3);

Scenario('Shared Document tab not visible for Intervener solicitor', async I => {
}).retry(3);

Scenario('Hearing tab not visible for Intervener solicitor', async I => {
}).retry(3);