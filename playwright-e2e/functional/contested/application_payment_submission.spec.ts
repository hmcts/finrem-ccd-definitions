import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd } from '../../../test/helpers/utils';
import { contestedEvents } from '../../config/case_events';

test(
    'Contested - Case Submission',
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
        const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
      
        // Login as solicitor
        await manageCaseDashboardPage.visit();
        await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
        await manageCaseDashboardPage.navigateToCase(caseId);
  
        // Case Submission 
        await caseDetailsPage.selectNextStep(contestedEvents.ApplicationPaymentSubmission); 
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

        await caseDetailsPage.checkHasBeenUpdated(contestedEvents.ApplicationPaymentSubmission.listItem);
    }
);
