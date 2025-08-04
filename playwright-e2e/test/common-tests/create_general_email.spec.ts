import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CommonEvents } from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import { createGeneralEmailTableData } from '../../resources/check_your_answer_content/create_general_email/createGeneralEmailTable';
import { createGeneralEmailTabDataConsented } from '../../resources/tab_content/consented/case_documents_tab';
import { DateHelper } from '../../data-utils/DateHelper';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import { createGeneralEmailTabDataContested } from '../../resources/tab_content/contested/case_documents_tab';

test.describe('Create General Email', () => {
    test(
        'Contested - Create General Email',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

            const recipientEmail = 'validEmail1@mailinator.com';

            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Crete General Email
            await caseDetailsPage.selectNextStep(CommonEvents.createGeneralEmail)
            // await createGeneralEmailPage.enterInvalidEmailAddressAndSubmit(); enable this for DFR-3942
            await createGeneralEmailPage.enterReceipientEmail(recipientEmail); 
            await createGeneralEmailPage.enterBodyOfEmail('This is a test');
            await createGeneralEmailPage.uploadDocument('playwright-e2e/resources/file/test.pdf');
            await createGeneralEmailPage.navigateContinue();

            // Assert check your answers page
            await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);
            await createGeneralEmailPage.navigateSubmit();
            // get the current date and time for assertion in tab
            const date= DateHelper.getUtcDateTimeFormatted();

            await caseDetailsPage.checkHasBeenUpdated(CommonEvents.createGeneralEmail.listItem);

            //assert case documents tab data
            await caseDetailsPage.assertTabData(createGeneralEmailTabDataContested(date))
        }
    )
    test(
        'Consented - Create General Email',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

            const recipientEmail = 'validEmail1@mailinator.com';

            // Create and setup case
            const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Crete General Email
            await caseDetailsPage.selectNextStep(CommonEvents.createGeneralEmail)
            // await createGeneralEmailPage.enterInvalidEmailAddressAndSubmit(); enable this for DFR-3942
            await createGeneralEmailPage.enterReceipientEmail(recipientEmail); 
            await createGeneralEmailPage.enterBodyOfEmail('This is a test');
            await createGeneralEmailPage.uploadDocument('playwright-e2e/resources/file/test.pdf');
            await createGeneralEmailPage.navigateContinue();

            // Assert check your answers page
            await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);
            await createGeneralEmailPage.navigateSubmit();
            // get the current date and time for assertion in tab
            const date= DateHelper.getUtcDateTimeFormatted();

            await caseDetailsPage.checkHasBeenUpdated(CommonEvents.createGeneralEmail.listItem);

            //assert case documents tab data
            await caseDetailsPage.assertTabData(createGeneralEmailTabDataConsented(date))
        }
    )
});
