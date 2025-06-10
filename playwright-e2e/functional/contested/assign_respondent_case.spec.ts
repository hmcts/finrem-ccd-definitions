import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { respondentAssignedCaseTabs } from '../../data/tab_content/contested/respondent_assigned_case_tabs';
import { assignCaseToRespondent } from '../data-utils/CaseAssignmentHelper';
import { ContestedCaseDataHelper } from '../data-utils/contested/ContestedCaseDataHelper';

test(
  'Contested - Respondent Assigned Case',
  { tag: [] },
  async ({
    loginPage,
    manageCaseDashboardPage,
    manageOrgDashboardPage,
    caseDetailsPage,
  }) => {
    // Create and process a form A case up to issue application
    const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

    // Login to Mange org and assign case to respondent
    await assignCaseToRespondent(loginPage, manageOrgDashboardPage, caseId);

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    await caseDetailsPage.assertTabData(respondentAssignedCaseTabs);
  }
);
