import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../../test/helpers/utils';
import { consentedEvents } from '../../../config/case_events';

test(
  'Test caseworker can see refuge answer in applicant tab',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage
    },
  ) => {
    // setup case to the point of being issued.
    // const caseId = await utils.createCaseInCcd(config.applicant_solicitor1.email, config.applicant_solicitor1.password, './test/data/ccd-contested-basic-data-refuge.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    // const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    // const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    // const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');

    // Login as caseworker
    // await manageCaseDashboardPage.visit();
    // await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    // await manageCaseDashboardPage.navigateToCase(caseId);
    // check applicant and respondent tabs
    // Logout
    // await manageCaseDashboardPage.signOut();

    // repeat for 
    

  }
);
