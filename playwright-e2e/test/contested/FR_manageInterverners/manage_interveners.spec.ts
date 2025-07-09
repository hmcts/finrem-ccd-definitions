import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import {
        manageAddIntervenerTableData, removeIntervenerTableData
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
    console.info(`Navigated to case with ID: ${caseId}`);
    await caseDetailsPage.assertTabData(manageIntervenerTabData);
    await manageCaseDashboardPage.signOut();
}

test.describe('Contested - Manage Interveners', () => {

    test(
    'Contested - Add & Remove Interveners, login as Intervener and verify.', {
        tag: []},
        async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageIntervenersPage, checkYourAnswersPage}) => {

            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false);
            //const caseId = '1751979889472423';
            const expectedUrl = ContestedEvents.manageInterveners.ccdCallback;
            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);
            console.info(`Navigated to case with ID: ${caseId}`);

            // Manage hearings
            await caseDetailsPage.selectNextStep(ContestedEvents.manageInterveners);

            await manageIntervenersPage.selectIntervenerRadio(1);
            await manageIntervenersPage.navigateContinue(expectedUrl, 2);
            await manageIntervenersPage.selectIntervenerActionRadio('Add', 1);
            await manageIntervenersPage.navigateContinue(expectedUrl, 3);
            await manageIntervenersPage.assertMandatoryFields();

            await manageIntervenersPage.enterIntervenersDetails(
                1,
                'Test Intervener',
                "fr_intervener1_solicitor@mailinator.com",
                false,
                true,
                {
                    representativeFullName: 'Test Representative',
                    representativeEmail: 'fr_intervener1_solicitor@mailinator.com',
                    representativePhoneNumber: '01234567890',
                    representativeFirm: 'Test Firm',
                    yourReference: 'Test Reference',
                    orgName: 'FinRem-1-Org'
                }
            )
            await manageIntervenersPage.navigateContinue(expectedUrl +"/submit");
            await checkYourAnswersPage.assertCheckYourAnswersPage(manageAddIntervenerTableData);
            await manageIntervenersPage.navigateSubmit();

            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);
            await caseDetailsPage.assertTabData(manageIntervenerCSTabData);
            await manageCaseDashboardPage.signOut();

            // login as Intervener and verify
            await verifyIntervenerAsDifferentUser(manageCaseDashboardPage, loginPage, caseDetailsPage, config.applicant_solicitor, config.loginPaths.cases, caseId);
            //await verifyIntervenerAsDifferentUser(manageCaseDashboardPage, loginPage, caseDetailsPage, config.respondent_solicitor, config.loginPaths.cases, caseId);

            // login as caseworker and Remove Intervener
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.manageInterveners);
            await manageIntervenersPage.selectIntervenerRadio(1);
            await manageIntervenersPage.navigateContinue(expectedUrl, 2);
            await manageIntervenersPage.selectIntervenerActionRadio('Remove', 1);
            await manageIntervenersPage.navigateContinue(expectedUrl +"/submit");
            await checkYourAnswersPage.assertCheckYourAnswersPage(removeIntervenerTableData);

            await manageIntervenersPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageInterveners.listItem);
            await caseDetailsPage.assertTabNotPresent('Intervener 1')
    });
}
);
