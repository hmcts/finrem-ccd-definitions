import {caseAssignmentApi, test} from '../../fixtures/fixtures';
import config from '../../config/config';
import {
  asExpectedApplicantRefugeStatus,
  cwExpectedApplicantRefugeStatus,
  jExpectedApplicantRefugeStatus,
  rsExpectedApplicantRefugeStatus
} from '../../resources/tab_content/contested/applicant_refuge_status_visibility_tabs';
import {ContestedCaseFactory} from '../../data-utils/factory/contested/ContestedCaseFactory';
import {CaseTypeEnum} from "../../pages/helpers/enums/RadioEnums.ts";


test(
  'Contested - Paper Case: Applicant Refuge Status Visibility',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage
    }
  ) => {
    // Create and process a paper case
    const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();

    // Assign case to applicant solicitor
    await caseAssignmentApi.assignCaseToApplicant(caseId, CaseTypeEnum.CONTESTED);
    // Assign case to respondent solicitor
    await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONTESTED);

    // Login as applicant sol
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(asExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(cwExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as judge
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(jExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(rsExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();
  }
);
