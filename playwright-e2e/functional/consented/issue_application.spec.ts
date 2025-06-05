import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { adminNotesTabData } from '../../data/tab_content/consented/admin_notes_tabs';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';

test(
  'Consented - Issue Application',
  { tag: [] },
  async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    issueApplicationPage,
  }) => {
    // Create case and progress to HWF decision made
    const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToHWFDecision();
    const dateToday = new Date()
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).replace(",", "");

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Issue Application
    await caseDetailsPage.selectNextStep(ConsentedEvents.issueApplication);
    await issueApplicationPage.navigateContinue();
    await issueApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.issueApplication.listItem);

    // Assert Tab Data
    await caseDetailsPage.assertTabData(adminNotesTabData(dateToday));
  }
);
