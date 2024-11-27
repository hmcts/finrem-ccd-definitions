import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';

test(
    'HWF Application Accepted',
    { tag: [] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        hwfApplicationAcceptedPage,
      },
    ) => {
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // HWF Payment
      await caseDetailsPage.selectNextStep(consentedEvents.HwfPaymentSubmission); 
      await hwfApplicationAcceptedPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated();
    }
);
