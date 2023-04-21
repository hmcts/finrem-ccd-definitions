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

Feature('Contested Events');


Scenario('Upload Case Files (Confidential Documents) @nightly', async I => {
    //login as a caseworker, create contested case

    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
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

Scenario('Contested Add Note  @nightly ', async I => { //Matrimonial
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.addNote();
}).retry(2);

Scenario('Contested Matrimonial case Amend application and Case submission  by Solicitor @nightly', async I => {
    //The json file used to create case is new case data - this can be used to create a case via solicitor, case type matrimonial.
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-solicitor-create-case.json', 'FinancialRemedyContested', 'FR_solicitorCreate');

    if (nightlyTest === 'true') {
        await I.signInIdam(solicitorUserName, solicitorPassword);
        await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);

        //amend application
        I.contestedAmendApplicationDetails();

        //case submission
        await I.caseSubmitAuthorisation('contested');
        await I.paymentPage(false);
        await I.hwfPaymentDetails();
        await I.paymentSubmission();
        await I.savingApplicationInformation('contested');
        await I.finalPaymentSubmissionPage();
        await I.finalInformationPage();
        I.see('Case Submission');
    }
}).retry(2);

Scenario('Caseworker refunds an issued case @nightly', async I => {
    logger.info("Refund test starting");
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.refundCase();

    logger.info("Refund test completed");
})

Scenario('Contested Add Note @nightly ', async I => {
    //Matrimonial
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.addNote();
}).retry(2);

Scenario('Contested Manage Barrister @nightly', async I => {
    //Matrimonial
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.manageBarristerApplicant();
    await I.manageBarristerRespondent();
    await I.verifyManageBarristerEvent(verifyTabText.caseType, verifyTabText.historyTab.manageBarristerEvent, verifyTabText.historyTab.issueApplicationEndState);
    await I.clickTab('Change of representatives');
    await I.waitForText('FinRem-1-Org', 30);
    await I.changeOfRepresentativesTab(verifyTabText.historyTab.manageBarristerEvent);
    logger.info("manage barrister tab verified...");
}).retry(2);

Scenario('List for hearing contested case @nightly', async I => {

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

Scenario('Contested E2E @nightly', async I => {
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
    const assignToJudge = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_allocateToJudge', './test/data/ccd-contested-case-worker-issue-data.json');
    const allocationDirections = await updateCaseInCcd(judgeUserName, judgePassword, caseId, 'FinancialRemedyContested', 'FR_giveAllocationDirections', './test/data/ccd-contested-allocation-directions.json');
    const listForHearing = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_addSchedulingListingInfo', './test/data/ccd-contested-list-for-hearing.json');

    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.uploadDraftOrder();
    await I.signOut();
    await I.signInIdam(judgeUserName, judgePassword);
    await I.waitForText('Judicial Case Manager');
    await I.enterCaseReference(caseId);
    await I.waitForText('Upload Draft Order');
    await I.draftOrderApprove();
    await I.signOut();
    await I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    await I.waitForText('Manage Cases');
    await I.enterCaseReference(caseId);
    await I.uploadOrder();
    await I.sendOrder();
    logger.info('-----------completed E2E contested test for -------------', caseId);
}).retry(2);

Scenario('Caseworker runs List for Interim Hearing @nightly', async I => {
    logger.info("List for Interim Hearing test starting");
    const caseId = await createCaseInCcd(solicitorUserName, solicitorPassword, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(solicitorUserName, solicitorPassword, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await updateCaseInCcd(caseWorkerUserName, caseWorkerPassword, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');

    I.signInIdam(caseWorkerUserName, caseWorkerPassword);
    I.amOnPage(`${ccdWebUrl}/v2/case/${caseId}`);
    await I.listForInterimHearing();
    await I.verifyListForInterimHearing();
    logger.info("List Of Interim Hearing Completed");
}).retry(2);
