import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { assignCaseToApplicant, assignCaseToRespondent } from '../helpers/CaseAssigmentHelper';
import { cwExpectedApplicantRefugeStatus, asExpectedApplicantRefugeStatus, rsExpectedApplicantRefugeStatus, jExpectedApplicantRefugeStatus } from '../../data/tab_content/contested/applicant_refuge_status_visibility_tabs';

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
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_manualPayment', './playwright-e2e/data/payload/contested/caseworker/manual-payment.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './playwright-e2e/data/payload/contested/caseworker/issue-application.json');

    // Login to Manage org and assign case to applicant
    await assignCaseToApplicant(loginPage, manageOrgDashboardPage, caseId);

    // Login to Manage org and assign case to respondent
    await assignCaseToRespondent(loginPage, manageOrgDashboardPage, caseId);

    // Login as applicant sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(asExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(cwExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as judge
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(jExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

    // Login as respondent sol
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData(rsExpectedApplicantRefugeStatus);
    await manageCaseDashboardPage.signOut();

});
