import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { approvedOrderTabData } from '../../data/tab_content/consented/approve_application_tabs';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';

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
    const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToIssueApplication();

    // Login in as judge
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Approve Application 
    await caseDetailsPage.selectNextStep(ConsentedEvents.approveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.approveApplication.listItem);

    // Assert Tab Data      
    await caseDetailsPage.assertTabData(approvedOrderTabData);
  }
);
