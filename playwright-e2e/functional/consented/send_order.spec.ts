import { test, expect } from '../../fixtures/fixtures.js';
import config from '../../config/config.js';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils.js';
import { consentedEvents } from '../../config/case_events.js';

// Remove as smoke test? Maybe nightly? Discuss with tom and other.
test(
  'Smoke Test - Consented Send order (All Manual)',
  { tag: ['@nighty'] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      caseSubmissionPage,
      hwfApplicationAcceptedPage,
      issueApplicationPage,
      approveApplicationPage,
      sendOrderPage
    },
  ) => {
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
  
    // Login as Solictor
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

    await caseDetailsPage.checkHasBeenUpdated();

    // Logout
    await manageCaseDashboardPage.signOut();

    // Login as caseworker
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // HWF Payment
    await caseDetailsPage.selectNextStep(consentedEvents.HwfPaymentSubmission); 
    await hwfApplicationAcceptedPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();

    // Issue Application
    await caseDetailsPage.selectNextStep(consentedEvents.IssueApplication); 
    await issueApplicationPage.navigateContinue();
    await issueApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();

    // Logout
    await manageCaseDashboardPage.signOut();

    // Login in as judge
    await loginPage.login(config.judge.email, config.judge.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Approve Application 
    await caseDetailsPage.selectNextStep(consentedEvents.ApproveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();

    // // Logout
    await manageCaseDashboardPage.signOut();

    // // Login as caseworker
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    await manageCaseDashboardPage.navigateToCase(caseId);
    
    // // Send order
    await caseDetailsPage.selectNextStep(consentedEvents.SendOrder); 
    await sendOrderPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();
  }
);

//// --- Event driven tests --- ////

test(
  'Smoke Test - Consented Send Order Journey - Application Payment Submission',
  { tag: ["@preview"] },
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

    await caseDetailsPage.checkHasBeenUpdated();
  }
);

test(
  'Smoke Test - Consented Send Order Journey - HWF Application Accepted',
  { tag: ["@preview"] },
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

test(
  'Smoke Test - Consented Send Order Journey - Issue Application',
  { tag: ["@preview"] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      issueApplicationPage,
    },
  ) => {
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
  
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Issue Application
    await caseDetailsPage.selectNextStep(consentedEvents.IssueApplication); 
    await issueApplicationPage.navigateContinue();
    await issueApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();
  }
);

test(
  'Smoke Test - Consented Send Order Journey - Approve Application',
  { tag: ["@preview"] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      approveApplicationPage,
    },
  ) => {
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
    const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');

    // Login in as judge
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.judge.email, config.judge.password);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Approve Application 
    await caseDetailsPage.selectNextStep(consentedEvents.ApproveApplication); 
    await approveApplicationPage.selectIsSubjectTo(true)
    await approveApplicationPage.selectIsPensionProvider(false);
    await approveApplicationPage.selectJudge('District Judge')
    await approveApplicationPage.navigateContinue();
    await approveApplicationPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();
  }
);

test(
  'Smoke Test - Consented Send Order Journey - Send Order',
  { tag: ["@preview"] },
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

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);
    await manageCaseDashboardPage.navigateToCase(caseId);
    
    // Send order
    await caseDetailsPage.selectNextStep(consentedEvents.SendOrder); 
    await sendOrderPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated();
  }
);
