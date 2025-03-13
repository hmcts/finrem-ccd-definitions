import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { paymentDetailsTabData } from '../../../data/tab_content/payment_details_tabs';

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
    const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './playwright-e2e/data/payload/contested/caseworker/issue-application.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_progressToSchedulingAndListing', './playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json');

    // Login as applicant solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // list for hearing
    await caseDetailsPage.selectNextStep(contestedEvents.listForHearing); 

    console.log('caseId:', caseId);
  }
);
