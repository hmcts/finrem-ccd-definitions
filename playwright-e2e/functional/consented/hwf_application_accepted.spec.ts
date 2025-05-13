import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { consentedEvents } from '../../config/case_events';
import { ConsentedCaseHelper } from '../helpers/Consented/ConsentedCaseHelper';

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
    const caseId = await ConsentedCaseHelper.createConsentedCaseUpToApplicationPaymentSubmission();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // HWF Payment
    await caseDetailsPage.selectNextStep(consentedEvents.hwfDecisionMade);
    await hwfApplicationAcceptedPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.hwfDecisionMade.listItem);
  }
);
