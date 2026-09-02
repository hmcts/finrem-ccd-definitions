import { test } from '../../fixtures/fixtures';
import { ConsentedEvents } from '../../config/case-data';
import { adminNotesTabData } from '../../resources/tab_content/consented/admin_notes_tabs';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';

test(
  'Consented - Issue Application',
  { tag: [] },
  async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    issueApplicationPage
  }) => {
    // Create case and progress to HWF decision made
    const caseId = Math.random() < 0.5 
      ? await ConsentedCaseFactory.createConsentedCaseUpToHWFDecision() 
      : await ConsentedCaseFactory.createConsentedCaseUpToHwfFeeAccountDebited();
    
    const dateToday = new Date()
      .toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).replace(',', '').replace(/\bSept\b/, 'Sep');

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginCaseworker();
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
