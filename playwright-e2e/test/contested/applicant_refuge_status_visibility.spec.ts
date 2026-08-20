import {caseAssignmentApi, test} from '../../fixtures/fixtures';
import config from '../../config/config';
import {
  asExpectedApplicantRefugeStatus,
  cwExpectedApplicantRefugeStatus,
  jExpectedApplicantRefugeStatus,
  rsExpectedApplicantRefugeStatus
} from '../../resources/tab_content/contested/applicant_refuge_status_visibility_tabs';
import {ContestedCaseFactory} from '../../data-utils/factory/contested/ContestedCaseFactory';
import {CaseTypeEnum} from '../../pages/helpers/enums/RadioEnums.ts';

test(
  'Contested - Paper Case: Applicant Refuge Status Visibility',
  {tag: []},
  async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage
  }) => {
    const caseId = await test.step(
      'Create and submit a paper case',
      async () => {return ContestedCaseFactory.createAndSubmitPaperCase();}
    );

    await test.step('Assign case to applicant solicitor', async () => {
      await caseAssignmentApi.assignCaseToApplicant(
        caseId,
        CaseTypeEnum.CONTESTED
      );
    });

    await test.step('Assign case to respondent solicitor', async () => {
      await caseAssignmentApi.assignCaseToRespondent(
        caseId,
        CaseTypeEnum.CONTESTED
      );
    });

    await test.step('Verify Applicant Solicitor visibility', async () => {
      await loginAndNavigateToCase(
        config.applicant_solicitor,
        caseId
      );

      await caseDetailsPage.selectHeader('Applicant');
      await caseDetailsPage.assertTabData(
        asExpectedApplicantRefugeStatus
      );

      await manageCaseDashboardPage.signOut();
    });

    await test.step('Verify Caseworker visibility', async () => {
      await loginAndNavigateToCase(
        config.caseWorker,
        caseId
      );

      await caseDetailsPage.selectHeader('Applicant');
      await caseDetailsPage.assertTabData(
        cwExpectedApplicantRefugeStatus
      );

      await manageCaseDashboardPage.signOut();
    });

    await test.step('Verify Judge visibility', async () => {
      await loginAndNavigateToCase(
        config.judge,
        caseId
      );

      await caseDetailsPage.selectHeader('Applicant');
      await caseDetailsPage.assertTabData(
        jExpectedApplicantRefugeStatus
      );

      await manageCaseDashboardPage.signOut();
    });

    await test.step('Verify Respondent Solicitor visibility', async () => {
      await loginAndNavigateToCase(
        config.respondent_solicitor,
        caseId
      );

      await caseDetailsPage.selectHeader('Applicant');
      await caseDetailsPage.assertTabData(
        rsExpectedApplicantRefugeStatus
      );

      await manageCaseDashboardPage.signOut();
    });

    async function loginAndNavigateToCase(
      user: { email: string; password: string },
      caseId: string
    ) {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        user.email,
        user.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );

      await manageCaseDashboardPage.navigateToCase(caseId);
    }
  }
);
