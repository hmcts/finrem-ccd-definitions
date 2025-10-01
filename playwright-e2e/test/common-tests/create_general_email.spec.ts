import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CommonEvents } from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import { createGeneralEmailTableData } from '../../resources/check_your_answer_content/create_general_email/createGeneralEmailTable';
import { createGeneralEmailTabDataConsented } from '../../resources/tab_content/consented/case_documents_tab';
import { DateHelper } from '../../data-utils/DateHelper';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import { createGeneralEmailTabDataContested } from '../../resources/tab_content/contested/case_documents_tab';
import { CreateGeneralEmailPage } from '../../pages/events/create-general-email/CreateGeneralEmailPage';
import { SigninPage } from '../../pages/SigninPage';
import { ManageCaseDashboardPage } from '../../pages/ManageCaseDashboardPage';
import { CaseDetailsPage } from '../../pages/CaseDetailsPage';
import { CheckYourAnswersPage } from '../../pages/CheckYourAnswersPage';

/**
 * How to run this test locally
 *
 * This test requires COS to make a genuine call to GOV.UK Notify.
 * When running COS locally, temporarily comment out the following line in EmailService:
 *
 *   https://github.com/hmcts/finrem-case-orchestration-service/blob/0ba1b00561046742d31d4fae10859e28d632d79b/src/main/java/uk/gov/hmcts/reform/finrem/caseorchestration/notifications/service/EmailService.java#L22
 *
 * Revert the change after running the test.
 */
test.describe('Create General Email', () => {
    test(
        'Contested - Create General Email',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
            await checkCommonSteps(loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage, caseId);

            //assert case documents tab data
            await caseDetailsPage.assertTabData(createGeneralEmailTabDataContested(DateHelper.getTodayFormattedDate()))
        }
    )

    test(
        'Consented - Create General Email',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

            const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();
            await checkCommonSteps(loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage, caseId);

            //assert case documents tab data
            await caseDetailsPage.assertTabData(createGeneralEmailTabDataConsented(DateHelper.getTodayFormattedDate()))
        }
    )

    /**
     * Checks the steps common to both contested and consented cases
     */
    async function checkCommonSteps(loginPage: SigninPage,
        manageCaseDashboardPage: ManageCaseDashboardPage,
        createGeneralEmailPage: CreateGeneralEmailPage,
        caseDetailsPage: CaseDetailsPage,
        checkYourAnswersPage: CheckYourAnswersPage,
        caseId: string) {
            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Create General Email
            await caseDetailsPage.selectNextStep(CommonEvents.createGeneralEmail)

            // Fill in the email body, this remains for subsequent attempts
            await createGeneralEmailPage.enterBodyOfEmail('This is a test');

            await checkForEmailAddressErrors(createGeneralEmailPage);

            // Assert success with valid information.
            await createGeneralEmailPage.enterReceipientEmail('fr_applicant_solicitor1@mailinator.com');
            await createGeneralEmailPage.uploadDocument('playwright-e2e/resources/file/test.pdf');
            await createGeneralEmailPage.navigateContinue();

            // Assert check your answers page
            await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);
            await createGeneralEmailPage.navigateSubmit();

            // Check success banners
            await caseDetailsPage.checkHasBeenUpdated(CommonEvents.createGeneralEmail.listItem);
    }

    /**
     * Function to check various email address errors
     * Requires the page under test to be FR_generalEmail1
     * Will return to that page at the end of the function
     */
    async function checkForEmailAddressErrors(createGeneralEmailPage: CreateGeneralEmailPage) {
        // Assert Mid event email validation works
        await createGeneralEmailPage.enterReceipientEmail("test");
        await createGeneralEmailPage.navigateContinue();
        createGeneralEmailPage.assertNotValidEmailAddress;

        // Assert a Bad request is handled gracefully.  Requires a genuine call to GOV.UK Notify to trigger the error.
        await createGeneralEmailPage.enterReceipientEmail("anEmail@mailinator.com");
        await createGeneralEmailPage.navigateContinue();
        await createGeneralEmailPage.navigateSubmit();
        createGeneralEmailPage.assertAnErrorOccurred;
        await createGeneralEmailPage.navigatePrevious();

        // Assert an email address failing GOV.UK notify validation is handled.  Requires a genuine call to GOV.UK Notify to trigger the error.
        await createGeneralEmailPage.enterReceipientEmail("anEmail@noDomainSuffix");
        await createGeneralEmailPage.navigateContinue();
        await createGeneralEmailPage.navigateSubmit();
        createGeneralEmailPage.assertAnGovUkFailedEmailAddressValidation;
        await createGeneralEmailPage.navigatePrevious();
    }
});
