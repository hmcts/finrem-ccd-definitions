import {caseAssignmentApi, test} from '../../fixtures/fixtures';
import config from '../../config/config';
import { respondentAssignedCaseTabs } from '../../resources/tab_content/contested/respondent_assigned_case_tabs';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import {CaseTypeEnum} from "../../pages/helpers/enums/RadioEnums.ts";

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
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

    // Assign case to applicant solicitor
    await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONTESTED);

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    await caseDetailsPage.assertTabData(respondentAssignedCaseTabs);
  }
);
