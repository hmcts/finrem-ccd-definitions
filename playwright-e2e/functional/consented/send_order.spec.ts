import { test, expect } from '../../fixtures/fixtures.js';
import config from '../../config.js';
// NOTE: When we remove codecept tests, bring utils into the playwright directory
import * as utils from '../../../test/helpers/utils.js';

test(
  'Smoke Test - Consented send order E2E',
  { tag: ['@smoke-test', "@preview", "@mytest"] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      sendOrderPage
    },
  ) => {
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
    const approveOrder = await utils.updateCaseInCcd(config.judge.email, config.judge.password, caseId, 'FinancialRemedyMVP2', 'FR_approveApplication', './test/data/ccd-consented-judge-approve-data.json');
    // const sendOrder = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_sendOrderForApproved', './test/data/ccd-caseworker-send-order.json');
  
    // Sign in as caseworker
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Send order
    await caseDetailsPage.selectNextStep("Send Order"); 
    await sendOrderPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();

    // Assign to judge

    // Sign in as judge

    // Navigate to case

    // Approve order

  }
);
