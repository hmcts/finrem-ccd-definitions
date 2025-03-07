import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { assignCaseToApplicant } from '../../../test/helpers/CommonActionsHelper';
import { respondentAssignedCaseTabs } from '../../data/tab_content/contested/respondent_assigned_case_tabs';

test(
  'Contested - Paper Case: Refuge Status Visilbity',
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
    //const manualPayment = 
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_manualPayment', './playwright-e2e/data/payload/contested/manual-payment.json');
    //const issueApplication = 
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './playwright-e2e/data/payload/contested/issue-application.json');

    // Login to Manage org and assign case to applicant
    await assignCaseToApplicant(config, manageOrgDashboardPage, loginPage, caseId);
    // wait for case to be assignment to be processed. 
    await manageOrgDashboardPage.wait(1000);

    // Login as applicant sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    //caseDetailsPage.assertTabData(respondentAssignedCaseTabs);
});
