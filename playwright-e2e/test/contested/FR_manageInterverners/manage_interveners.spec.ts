import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';


test.describe('Contested - Manage Interveners', () => {

        test(
            'Contested - Add Interveners, login as Intervener and verify. Then remove the intervener', {
                tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageIntervenersPage, checkYourAnswersPage}) => {

                // Create and setup case
                const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false);
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

                await manageIntervenersPage.enterIntervernersDetails(
                    1,
                    'Test Intervener',
                    config.caseWorker.email,
                    {
                        representativeFullName: 'Test Representative',
                        representativeEmail: config.caseWorker.email,
                        representativePhoneNumber: '01234567890',
                        representativeFirm: 'Test Firm',
                        yourReference: 'Test Reference',
                        orgName: 'FinRem-1-Org'

                    }
                )

                //await checkYourAnswersPage.assertCheckYourAnswersPage(expectedTable);

                await manageIntervenersPage.navigateSubmit();

                await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);

            });


    }
);
