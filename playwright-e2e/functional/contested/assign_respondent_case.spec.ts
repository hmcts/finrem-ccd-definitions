import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import * as utils from '../../../test/helpers/utils';
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
    const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
    const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json');
    const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './test/data/ccd-contested-case-worker-issue-data.json');
        
    // Login to Mange org and assign case to respondent
    await manageOrgDashboardPage.visit();
    await loginPage.login(config.respondentCAA.email, config.respondentCAA.password, config.manageOrgBaseURL);
    await manageOrgDashboardPage.assignToCase(caseId, config.respondent_solicitor.email);

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    caseDetailsPage.assertTabData(respondentAssignedCaseTabs);
});
