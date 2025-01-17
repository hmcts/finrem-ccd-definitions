import { test, expect } from '../fixtures/fixtures';
import config from '../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../test/helpers/utils';
import { consentedEvents } from '../config/case_events';

test(
  'Consented - Send Order Journey Test',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      solicitorAuthPage,
      helpWithFeesPage,
      paymentPage,
      orderSummaryPage,
      caseSubmissionPage,
      issueApplicationPage,
      approveApplicationPage
    }
  ) => {

    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    
    // Login as Solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Application Payment Submission 
    await caseDetailsPage.selectNextStep(consentedEvents.ApplicationPaymentSubmission); 
    await solicitorAuthPage.enterSolicitorDetails('Bilbo Baggins', 'Bag End', 'Solicitor');
    await solicitorAuthPage.navigateContinue();
    await helpWithFeesPage.selectHelpWithFees(false);
    await helpWithFeesPage.navigateContinue();
    await paymentPage.enterPaymentDetails('PBA0000539', 'Reference');
    await paymentPage.navigateContinue();
    await orderSummaryPage.navigateContinue();
    await caseSubmissionPage.navigateContinue();
    await caseSubmissionPage.navigateSubmit();
    await caseSubmissionPage.returnToCaseDetails();
  
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.ApplicationPaymentSubmission.listItem);
  
    // Logout
    await manageCaseDashboardPage.signOut();
  
    // Login as caseworker
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Issue Application
    await caseDetailsPage.selectNextStep(consentedEvents.IssueApplication); 
    await issueApplicationPage.navigateContinue();
    await issueApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.IssueApplication.listItem);
  
    // Logout
    await manageCaseDashboardPage.signOut();
  
    // Login in as judge
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Approve Application 
    await caseDetailsPage.selectNextStep(consentedEvents.ApproveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true);
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge');
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.ApproveApplication.listItem);
  }
);
