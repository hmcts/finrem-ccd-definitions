import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CommonEvents } from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import { createGeneralEmailTableData } from '../../resources/check_your_answer_content/create_general_email/createGeneralEmailTable';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import { createGeneralEmailTabData } from '../../resources/tab_content/common-tabs/case_documents_tab';
import { CaseDetailsPage } from '../../pages/CaseDetailsPage';


/**
 * Attempts to assert the General Email tab data using a collection of
 * possible timestamps.
 *
 * The timestamps are tried in their supplied order. The method returns as
 * soon as an assertion succeeds. If every assertion fails, the final
 * assertion error is rethrown.
 *
 * @param caseDetailsPage Page object used to perform the tab assertion.
 * @param possibleDateTimes Possible timestamps ordered by preference.
 * @param tabName Name of the case-details tab containing the email data.
 * @throws The final assertion error when none of the timestamps match.
 */
async function assertGeneralEmailTabDataForPossibleDates(
  caseDetailsPage: CaseDetailsPage,
  possibleDateTimes: string[],
  tabName: string = 'Case documents'
): Promise<void> {
  if (possibleDateTimes.length === 0) {
    throw new Error(
      'At least one possible date and time must be provided.'
    );
  }

  let lastError: unknown;

  for (const possibleDateTime of possibleDateTimes) {
    try {
      await caseDetailsPage.assertTabData(
        createGeneralEmailTabData(
          possibleDateTime,
          tabName
        ),
        1_000 // shorter test timeout for faster retries.
      );

      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

test.describe('Create General Email', () => {
  test(
    'Contested - Create General Email',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

      const recipientEmail = 'fr_respondent_solicitor1@mailinator.com';

      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Create General Email
      await caseDetailsPage.selectNextStep(CommonEvents.createGeneralEmail);
      await createGeneralEmailPage.enterBodyOfEmail('This is a test');
      await createGeneralEmailPage.enterInvalidEmailAddressAndSubmit(); // assert error message for invalid email
      await createGeneralEmailPage.enterReceipientEmail(recipientEmail);
      await createGeneralEmailPage.uploadDocument('playwright-e2e/resources/file/test.pdf');
      await createGeneralEmailPage.navigateContinue();

      // Assert check your answers page
      await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);

      await createGeneralEmailPage.navigateSubmit();

      const tabDateTimesToTry = createGeneralEmailPage.getDateTimesForTabText();

      await caseDetailsPage.checkHasBeenUpdated(
        CommonEvents.createGeneralEmail.listItem
      );

      await assertGeneralEmailTabDataForPossibleDates(
        caseDetailsPage,
        tabDateTimesToTry
      );
    }
  );
  test(
    'Consented - Create General Email',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, createGeneralEmailPage, caseDetailsPage, checkYourAnswersPage }) => {

      const recipientEmail = 'fr_respondent_solicitor1@mailinator.com';

      // Create and setup case
      const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Crete General Email
      await caseDetailsPage.selectNextStep(CommonEvents.createGeneralEmail);
      await createGeneralEmailPage.enterBodyOfEmail('This is a test');
      await createGeneralEmailPage.enterInvalidEmailAddressAndSubmit(); // assert error message for invalid email
      await createGeneralEmailPage.enterReceipientEmail(recipientEmail); 
      await createGeneralEmailPage.uploadDocument('playwright-e2e/resources/file/test.pdf');
      await createGeneralEmailPage.navigateContinue();

      // Assert check your answers page
      await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralEmailTableData);

      await createGeneralEmailPage.navigateSubmit();

      const tabDateTimesToTry = createGeneralEmailPage.getDateTimesForTabText();

      await caseDetailsPage.checkHasBeenUpdated(
        CommonEvents.createGeneralEmail.listItem
      );

      await assertGeneralEmailTabDataForPossibleDates(
        caseDetailsPage,
        tabDateTimesToTry,
        'Case Documents' // override as Contested tab is called 'Case documents'
      );
    }
  );
});
