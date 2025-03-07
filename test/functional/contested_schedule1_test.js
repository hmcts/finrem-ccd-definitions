const { createCaseInCcd, updateCaseInCcd, createSolicitorReference, createCaseworkerReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-contested-tab-data.json');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('helpers/utils.js');

// eslint-disable max-len

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const solRef = `AUTO-${createSolicitorReference()}`;
const caRef= `AUTO-${createCaseworkerReference()}`;
const runningEnv = process.env.RUNNING_ENV;

Feature('Contested Schedule 1 Tests');

Scenario('Contested Schedule 1 Case Creation by Solicitor @nightly', async ({ I }) => {
    await I.signInIdam(solicitorUserName, solicitorPassword);
    await I.wait('2');
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
    await I.waitForText('Form A Application', '60')
}).retry(3);

Scenario('Contested Schedule 1 Case Creation by Solicitor using API call @nightly', async ({ I }) => {
    //The json file used to create case is new case data - this can be used to create a case via solicitor, case type schedule 1.
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-schedule1-solicitor-create-case.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/cases/case-details/${caseId}#Schedule%201/Child%20Details`);
    I.wait('15');
    //Navigating directly to schedule 1 tab
    await I.schedule1Tab(verifyTabText.Schedule1Tab.tabName);
    logger.info('Schedule 1 tab verified...')
}).retry(3);