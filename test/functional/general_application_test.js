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
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const solRef = `AUTO-${createSolicitorReference()}`;
const caRef= `AUTO-${createCaseworkerReference()}`;
const runningEnv = process.env.RUNNING_ENV;

Feature('General Application');

Scenario.skip('General Application e2e Test @nightly', async ({ I }) => {
    logger.info("General application test starting");
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(solicitorUserName, solicitorPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    await I.solicitorCreateGeneralApplication();
    await I.verifyGeneralApplicationTab("Created");

    await I.signOut();
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    await I.caseWorkerReferGeneralApplication();
    await I.verifyGeneralApplicationTab("Referred To Judge");

    await I.signOut();
    await I.signInIdam(judgeUserName, judgePassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    await I.judgeGeneralApplicationOutcome();
    await I.verifyGeneralApplicationTab("Approved");

    await I.signOut();
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

    await I.generalApplicationDirections();
    await I.verifyGeneralApplicationTab("Approved, Completed");
}).retry(3);