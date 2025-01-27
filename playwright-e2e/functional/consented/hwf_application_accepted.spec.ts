import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';

test(
    'Consented - HWF Application Accepted',
    { tag: [] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        hwfApplicationAcceptedPage,
      },
    ) => {
      const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // HWF Payment
      await caseDetailsPage.selectNextStep(consentedEvents.HwfPaymentSubmission); 
      await hwfApplicationAcceptedPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.HwfPaymentSubmission.listItem);
    }
);
