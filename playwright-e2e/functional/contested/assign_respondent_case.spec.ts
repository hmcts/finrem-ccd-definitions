import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { respondentAssignedCaseTabs } from '../../data/tab_content/contested/respondent_assigned_case_tabs';

test(
  'Contested - Respondent Assigned Case',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      manageOrgDashboardPage,
      caseDetailsPage
    }
  ) => {
    const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json');
    const issueApplication = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
        
    // Login to Mange org and assign case to respondent
    await manageOrgDashboardPage.visit();
    await loginPage.login(config.respondentCAA.email, config.respondentCAA.password, config.manageOrgBaseURL);
    await manageOrgDashboardPage.searchAndSelectCaseToAssign(caseId);
    await manageOrgDashboardPage.assignCaseToEmail(config.respondent_solicitor.email);
    await manageOrgDashboardPage.navigateContinue();
    await manageOrgDashboardPage.navigateConfirm();
    // wait for case to be assignment to be processed. 
    await manageOrgDashboardPage.wait(1000);

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    caseDetailsPage.assertTabData(respondentAssignedCaseTabs);
});
