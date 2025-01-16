import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';

test(
    'Consented - Issue Application',
    { tag: [] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        issueApplicationPage,
      },
    ) => {
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
      const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');
    
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Issue Application
      await caseDetailsPage.selectNextStep(consentedEvents.IssueApplication); 
      await issueApplicationPage.navigateContinue();
      await issueApplicationPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.IssueApplication.listItem);
    }
);
