import { test } from '../../fixtures/fixtures'
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';

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
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Application Payment Submission 
      await caseDetailsPage.selectNextStep(consentedEvents.ApplicationPaymentSubmission); 
      await solicitorAuthPage.enterSolicitorDetails("Bilbo Baggins", "Bag End", "Solicitor");
      await solicitorAuthPage.navigateContinue();
      await helpWithFeesPage.selectHelpWithFees(false);
      await helpWithFeesPage.navigateContinue();
      await paymentPage.enterPaymentDetails("PBA0000539", "Reference");
      await paymentPage.navigateContinue();
      await orderSummaryPage.navigateContinue();
      await caseSubmissionPage.navigateContinue();
      await caseSubmissionPage.navigateSubmit();
      await caseSubmissionPage.returnToCaseDetails();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.ApplicationPaymentSubmission.listItem);
    }
);
