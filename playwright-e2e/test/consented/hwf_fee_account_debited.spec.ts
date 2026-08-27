import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';

test(
  'Consented - Fee Account Debited',
  { tag: [] },
  async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    hwfFeeAccountDebitedPage
  }) => {

    // Create case and progress to Application Payment Submission
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToApplicationPaymentSubmission();

    // Login as caseworker
    await manageCaseDashboardPage.visit();

    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
    
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Fee Account Debited
    await caseDetailsPage.selectNextStep(ConsentedEvents.hwfFeeAccountDebited);
    await hwfFeeAccountDebitedPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.hwfFeeAccountDebited.listItem);
  }
);