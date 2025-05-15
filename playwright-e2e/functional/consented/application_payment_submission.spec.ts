import { test } from '../../fixtures/fixtures'
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { paymentDetailsTabData } from '../../data/tab_content/payment_details_tabs';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';

test(
    'Consented - Application Payment Submission',
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
        caseSubmissionPage
      },
    ) => {
      // Create case
      const caseId = await ConsentedCaseDataHelper.createConsentedCase();

      // Define common test data
      const pbaNumber = "PBA0000539";
      const reference = "Reference";
      const hasHelpWithFees = false;
      
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Application Payment Submission 
      await caseDetailsPage.selectNextStep(ConsentedEvents.applicationPaymentSubmission); 
      await solicitorAuthPage.enterSolicitorDetails("Bilbo Baggins", "Bag End", "Solicitor");
      await solicitorAuthPage.navigateContinue();
      await helpWithFeesPage.selectHelpWithFees(hasHelpWithFees);
      await helpWithFeesPage.navigateContinue();
      await paymentPage.enterPaymentDetails(pbaNumber, reference);
      await paymentPage.navigateContinue();
      await orderSummaryPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateSubmit();
      await caseSubmissionPage.returnToCaseDetails();
      await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.applicationPaymentSubmission.listItem);
      
      // Assert Tab Data      
      await caseDetailsPage.assertTabData(paymentDetailsTabData(hasHelpWithFees, pbaNumber, reference));
    }
);
