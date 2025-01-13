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
        caseSubmissionPage,
      },
    ) => {
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      
      // Login as caseworker
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
  
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.ApplicationPaymentSubmission.listItem);
    }
);
