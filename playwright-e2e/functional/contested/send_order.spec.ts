import { test, expect } from '../../fixtures/fixtures.js';
import config from '../../config.js';
// NOTE: When we remove codecept tests, bring utils into the playwright directory
import * as utils from '../../../test/helpers/utils.js';

test(
  'Smoke Test - Contested send order E2E',
  { tag: ['@smoke-test', "@preview", "@mytest"] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage
    },
  ) => {
    // Setup issued application
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './test/data/ccd-contested-basic-data.json');
    const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
  
    // Sign in as caseworker
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Upload Draft Order

    // Sign out caseworker

    // Sign in as judge

    // Navigate to case

    // Approve draft order

    // Sign out Judge

    // Sign in caseworker 

    // Navigate to case

    // upload order

    // send order

  }
);
