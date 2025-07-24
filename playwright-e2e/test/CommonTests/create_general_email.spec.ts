import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedEvents } from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import { CreateGeneralEmailPage } from '../../pages/events/create-general-email/CreateGeneralEmailPage';
import { createGeneralEmailTableData } from '../../resources/check_your_answer_content/create_general_email/createGeneralEmailTable';


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
            await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralEmail)
            // await createGeneralEmailPage.enterInvalidEmailAddressAndSubmit(); add this for DFR-3942
            await createGeneralEmailPage.enterReceipientEmail(recipientEmail); 
            await createGeneralEmailPage.enterBodyOfEmail('This is a test');
            await createGeneralEmailPage.uploadDocument('playwright-e2e/data-utils/files/contested/contested-application.pdf');
            await createGeneralEmailPage.navigateContinue();
            await createGeneralEmailPage.navigateSubmit();

            // Assert check your answers page
            await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);
            await createGeneralEmailPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenCreated();

            //assert case documents tab data
        }
    )
});