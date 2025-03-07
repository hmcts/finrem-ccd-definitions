import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { assignCaseToApplicant, assignCaseToRespondent } from '../../../test/helpers/CommonActionsHelper';
import { applicantRefugeStatusVisibility } from '../../data/tab_content/contested/applicant_refuge_status_visibility_tabs';

test(
  'Contested - Paper Case: Applicant Refuge Status Visilbity',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      manageOrgDashboardPage,
      caseDetailsPage
    }
  ) => {
    const caseId = await createCaseInCcd(config.caseWorker.email, config.caseWorker.password, './playwright-e2e/data/payload/contested/paper_case/ccd-contested-refuge-applicant.json', 'FinancialRemedyContested', 'FR_newPaperCase');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_manualPayment', './playwright-e2e/data/payload/contested/manual-payment.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './playwright-e2e/data/payload/contested/issue-application.json');

    // Login to Manage org and assign case to applicant
    await assignCaseToApplicant(config, manageOrgDashboardPage, loginPage, caseId);

    // Login to Manage org and assign case to respondent
    await assignCaseToRespondent(config, manageOrgDashboardPage, loginPage, caseId);

    // Login as applicant sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await manageCaseDashboardPage.wait(1000);

    caseDetailsPage.assertTabData(applicantRefugeStatusVisibility);
});
