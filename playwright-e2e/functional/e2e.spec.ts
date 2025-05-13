import { test } from '../fixtures/fixtures';
import config from '../config/config';
import { consentedEvents } from '../config/case_events';
import { ConsentedCaseHelper } from './helpers/Consented/ConsentedCaseHelper';

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

    const caseId = await ConsentedCaseHelper.createConsentedCase();
    
    // Login as Solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Application Payment Submission 
    await caseDetailsPage.selectNextStep(consentedEvents.applicationPaymentSubmission); 
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
  
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.applicationPaymentSubmission.listItem);
  
    // Logout
    await manageCaseDashboardPage.signOut();
  
    // Login as caseworker
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Issue Application
    await caseDetailsPage.selectNextStep(consentedEvents.issueApplication); 
    await issueApplicationPage.navigateContinue();
    await issueApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.issueApplication.listItem);
  
    // Logout
    await manageCaseDashboardPage.signOut();
  
    // Login in as judge
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
  
    // Approve Application 
    await caseDetailsPage.selectNextStep(consentedEvents.approveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true);
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge');
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(consentedEvents.approveApplication.listItem);
  }
);
