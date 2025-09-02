import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import {
    manageAddIntervenerNotRepresentedTableData,
    manageAddIntervenerRepresentedTableData, removeIntervenerTableData
} from "../../../resources/check_your_answer_content/manage_interveners/manageIntervenerTable.ts";
import {
    manageIntervenerCSTabData, manageIntervenerTabData,
} from "../../../resources/tab_content/contested/manage_intervener_tab.ts";
import {ManageCaseDashboardPage} from "../../../pages/ManageCaseDashboardPage.ts";
import {SigninPage} from "../../../pages/SigninPage.ts";
import {CaseDetailsPage} from "../../../pages/CaseDetailsPage.ts";

async function verifyIntervenerAsDifferentUser(
    manageCaseDashboardPage: ManageCaseDashboardPage,
    loginPage: SigninPage,
    caseDetailsPage: CaseDetailsPage,
    userCredentials: { email: string, password: string },
    worklistUrl: string,
    caseId: string
) {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(userCredentials.email, userCredentials.password, config.manageCaseBaseURL, worklistUrl);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(manageIntervenerTabData);
    await manageCaseDashboardPage.signOut();
}

test.describe('Contested - Manage Interveners', () => {

    test(
    'Contested - Add & Remove Interveners, login as Intervener and verify.', {
        tag: []},
        async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageIntervenersPage, checkYourAnswersPage, axeUtils}, testInfo) => {
            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false);
            const expectedUrl = ContestedEvents.manageInterveners.ccdCallback;

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);
            console.info(`Navigated to case with ID: ${caseId}`);

            // Manage Interveners - Add Intervener 1 Represented
            await caseDetailsPage.selectNextStep(ContestedEvents.manageInterveners);
            await manageIntervenersPage.selectIntervenerRadio(1);
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl, 2);
            await manageIntervenersPage.selectIntervenerActionRadio('Add', 1);
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl, 3);
            await manageIntervenersPage.assertMandatoryFields();

            await manageIntervenersPage.enterIntervenersDetails(
                1,
                'Test Intervener',
                config.applicant_intervener.email,
                true,
                true,
                {
                    representativeFullName: 'Test Representative',
                    representativeEmail: config.applicant_intervener.email,
                    representativePhoneNumber: '01234567890',
                    representativeFirm: 'Test Firm',
                    yourReference: 'Test Reference',
                    orgName: 'FinRem-1-Org'
                }
            )
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl +"/submit");
            await checkYourAnswersPage.assertCheckYourAnswersPage(manageAddIntervenerRepresentedTableData);
            await manageIntervenersPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);

            // Manage Interveners - Add Intervener 2 details - Not Represented
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);
            await caseDetailsPage.selectNextStep(ContestedEvents.manageInterveners);
            await manageIntervenersPage.selectIntervenerRadio(2);
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl, 2);
            await manageIntervenersPage.selectIntervenerActionRadio('Add', 2);
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl, 5);

            await manageIntervenersPage.enterIntervenersDetails(
                2,
                'Test Intervener 2',
                config.applicant_intervener.email,
                true,
                false,
                {}
            )
            await manageIntervenersPage.navigateContinue(expectedUrl +"/submit");
            await axeUtils.audit();
            await checkYourAnswersPage.assertCheckYourAnswersPage(manageAddIntervenerNotRepresentedTableData);
            await manageIntervenersPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);

            await caseDetailsPage.assertTabData(manageIntervenerCSTabData);
            await manageCaseDashboardPage.signOut();

            // login as Intervener & applicant sol and verify
            await verifyIntervenerAsDifferentUser(manageCaseDashboardPage, loginPage, caseDetailsPage, config.applicant_solicitor, config.loginPaths.cases, caseId);
            await verifyIntervenerAsDifferentUser(manageCaseDashboardPage, loginPage, caseDetailsPage, config.applicant_intervener, config.loginPaths.cases, caseId);

            // login as caseworker and Remove Intervener
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.manageInterveners);
            await manageIntervenersPage.selectIntervenerRadio(1);
            await manageIntervenersPage.navigateContinue(expectedUrl, 2);
            await manageIntervenersPage.selectIntervenerActionRadio('Remove', 1);
            await axeUtils.audit();
            await manageIntervenersPage.navigateContinue(expectedUrl +"/submit");
            await checkYourAnswersPage.assertCheckYourAnswersPage(removeIntervenerTableData);

            await manageIntervenersPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);
            await caseDetailsPage.assertTabNotPresent('Intervener 1');
    });
});
