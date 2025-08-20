import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { approvedOrderTabData } from '../../resources/tab_content/consented/approve_application_tabs';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';

test(
  'Consented - Approve Application - Assign to Judge - Upload Approved Order - Send Order',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      approveApplicationPage,
      allocateToJudgePage,
      sendOrderPage,
      axeUtils
    }, testInfo
  ) => {
    // Create case and progress to Issue Application
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();

    // Login in as judge
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Approve Application 
    await caseDetailsPage.selectNextStep(ConsentedEvents.approveApplication);
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await axeUtils.audit();
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.approveApplication.listItem);

    // Assert Tab Data      
    await caseDetailsPage.assertTabData(approvedOrderTabData);
    await manageCaseDashboardPage.signOut();

    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assign to Judge
    await caseDetailsPage.selectNextStep(ConsentedEvents.assignToJudgeConsentMade);
    await allocateToJudgePage.verifyAssignToJudgeHeader();
    await allocateToJudgePage.selectAssignToJudgeReason('Draft consent/variation order');
    await allocateToJudgePage.selectAssignToJudgeList('New Application');
    await allocateToJudgePage.enterAssignToJudgeDate();
    await allocateToJudgePage.enterAssignToJudgeText("This is a test text for the judge assignment.");
    await axeUtils.audit();
    await allocateToJudgePage.navigateContinue();
    await allocateToJudgePage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.assignToJudgeConsentMade.listItem);

    await manageCaseDashboardPage.signOut();

    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    
    // Upload Approved Order as Judge
    await caseDetailsPage.selectNextStep(ConsentedEvents.uploadApprovedOrder);
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await approveApplicationPage.uploadConsentOrderFile('consentOrder.pdf');
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.uploadApprovedOrder.listItem);

    await manageCaseDashboardPage.signOut();
    
    // Send Order
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    await caseDetailsPage.selectNextStep(ConsentedEvents.sendOrder);
    await sendOrderPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.sendOrder.listItem);

    await manageCaseDashboardPage.signOut();
  }
);
