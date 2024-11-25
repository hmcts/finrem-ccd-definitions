import { test, expect } from '../fixtures/fixtures';
import config from '../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../test/helpers/utils';
import { consentedEvents } from '../config/case_events';

test(
    'Consented Send order - Journey Test',
    { tag: ['@nighty'] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        caseSubmissionPage,
        hwfApplicationAcceptedPage,
        issueApplicationPage,
        approveApplicationPage,
        sendOrderPage
      },
    ) => {
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    
      // Login as Solicitor
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Application Payment Submission 
      await caseDetailsPage.selectNextStep(consentedEvents.ApplicationPaymentSubmission); 
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateSubmit();
      await caseSubmissionPage.returnToCaseDetails();
  
      await caseDetailsPage.checkHasBeenUpdated();
  
      // Logout
      await manageCaseDashboardPage.signOut();
  
      // Login as caseworker
      await loginPage.login(config.caseWorker.email, config.caseWorker.password);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // HWF Payment
      await caseDetailsPage.selectNextStep(consentedEvents.HwfPaymentSubmission); 
      await hwfApplicationAcceptedPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated();
  
      // Issue Application
      await caseDetailsPage.selectNextStep(consentedEvents.IssueApplication); 
      await issueApplicationPage.navigateContinue();
      await issueApplicationPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated();
  
      // Logout
      await manageCaseDashboardPage.signOut();
  
      // Login in as judge
      await loginPage.login(config.judge.email, config.judge.password);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Approve Application 
      await caseDetailsPage.selectNextStep(consentedEvents.ApproveApplication); 
      await approveApplicationPage.selectIsSubjectTo(true)
      await approveApplicationPage.selectIsPensionProvider(false);
      await approveApplicationPage.selectJudge('District Judge')
      await approveApplicationPage.navigateContinue();
      await approveApplicationPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated();
  
      // // Logout
      await manageCaseDashboardPage.signOut();
  
      // // Login as caseworker
      await loginPage.login(config.caseWorker.email, config.caseWorker.password);
      await manageCaseDashboardPage.navigateToCase(caseId);
      
      // // Send order
      await caseDetailsPage.selectNextStep(consentedEvents.SendOrder); 
      await sendOrderPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated();
    }
);