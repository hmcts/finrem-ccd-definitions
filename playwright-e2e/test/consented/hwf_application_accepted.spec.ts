import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';


test(
  'Consented - HWF Application Accepted',
  { tag: [] },
  async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    hwfApplicationAcceptedPage,
  }) => {
    // Create case and progress to Application Payment Submission
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToApplicationPaymentSubmission();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // HWF Payment
    await caseDetailsPage.selectNextStep(ConsentedEvents.hwfDecisionMade);
    await hwfApplicationAcceptedPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.hwfDecisionMade.listItem);
  }
);
