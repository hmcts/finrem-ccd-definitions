import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { consentedEvents } from '../../config/case_events';
import { approvedOrderTabData } from '../../data/tab_content/consented/approve_application_tabs';
import { ConsentedCaseHelper } from '../helpers/Consented/ConsentedCaseHelper';

test(
  'Consented - Approve Application',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      approveApplicationPage,
    },
  ) => {
    // Create case and progress to Issue Application
    const caseId = await ConsentedCaseHelper.createConsentedCaseUpToIssueApplication();

    // Login in as judge
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Approve Application 
    await caseDetailsPage.selectNextStep(consentedEvents.approveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.approveApplication.listItem);

    // Assert Tab Data      
    await caseDetailsPage.assertTabData(approvedOrderTabData);
  }
);
