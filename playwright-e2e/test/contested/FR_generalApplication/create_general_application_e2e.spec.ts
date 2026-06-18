import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { contestedGeneralApplicationDirectionsTableData } from '../../../resources/check_your_answer_content/general_applcations_directions/generalApplicationDirectionsTable';
import { contestedGeneralApplicationJudgeTabData, contestedGeneralApplicationReferToJudgeTabData, contestedGeneralApplicationTabData } from '../../../resources/tab_content/contested/general_applications_tab';
import { generalApplicationTableData } from '../../../resources/check_your_answer_content/create_general_application/createGeneralApplicationsTable';

test.describe('Contested General Application e2e', () => {
  test(
      'Contested - General Application e2e',
      { tag: [] },
      async ({
               loginPage,
               manageCaseDashboardPage,
               caseDetailsPage,
               createGeneralApplicationPage,
               referToJudgeApplicationPage,
               generalApplicationOutcomePage,
               generalApplicationDirectionsPage,
               checkYourAnswersPage,
               axeUtils,
             }) => {
        const caseId = await test.step(
            'Create and process Form A case up to Issue Application',
            async () => {
              return await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
            }
        );

        await test.step('Caseworker creates General Application', async () => {
          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
              config.caseWorker.email,
              config.caseWorker.password,
              config.manageCaseBaseURL,
              config.loginPaths.worklist
          );

          await manageCaseDashboardPage.navigateToCase(caseId);

          await caseDetailsPage.selectNextStep(
              ContestedEvents.createGeneralApplication
          );

          await createGeneralApplicationPage.selectHearing(true);
          await createGeneralApplicationPage.fillTimeEstimate('5');
          await createGeneralApplicationPage.uploadGeneralDocument(
              './playwright-e2e/resources/file/test.docx'
          );

          await axeUtils.audit();

          await createGeneralApplicationPage.navigateContinue();

          await checkYourAnswersPage.assertCheckYourAnswersPage(
              generalApplicationTableData
          );

          await createGeneralApplicationPage.navigateSubmit();

          await caseDetailsPage.checkHasBeenUpdated(
              ContestedEvents.createGeneralApplication.listItem
          );
        });

        await test.step('Caseworker refers General Application to Judge', async () => {
          await caseDetailsPage.selectNextStep(
              ContestedEvents.generalApplicationReferToJudge
          );

          await referToJudgeApplicationPage.navigateContinue();
          await referToJudgeApplicationPage.enterEventSummary('Test');

          await axeUtils.audit();

          await referToJudgeApplicationPage.navigateSubmit();

          await caseDetailsPage.checkHasBeenUpdated(
              ContestedEvents.generalApplicationReferToJudge.listItem
          );

          await caseDetailsPage.assertTabData(
              contestedGeneralApplicationReferToJudgeTabData
          );
        });

        await test.step('Judge records General Application outcome', async () => {
          await manageCaseDashboardPage.signOut();

          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
              config.judge.email,
              config.judge.password,
              config.manageCaseBaseURL,
              config.loginPaths.cases
          );

          await manageCaseDashboardPage.navigateToCase(caseId);

          await caseDetailsPage.selectNextStep(
              ContestedEvents.generalApplicationOutcome
          );

          await generalApplicationOutcomePage.selectGeneralApplicationOutcome();
          await generalApplicationOutcomePage.navigateContinue();
          await generalApplicationOutcomePage.enterEventSummary('Test');

          await axeUtils.audit();

          await generalApplicationOutcomePage.navigateSubmit();

          await caseDetailsPage.checkHasBeenUpdated(
              ContestedEvents.generalApplicationOutcome.listItem
          );

          await caseDetailsPage.assertTabData(
              contestedGeneralApplicationJudgeTabData
          );
        });

        await test.step('Caseworker issues General Application directions', async () => {
          await manageCaseDashboardPage.signOut();

          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(
              config.caseWorker.email,
              config.caseWorker.password,
              config.manageCaseBaseURL,
              config.loginPaths.worklist
          );

          await manageCaseDashboardPage.navigateToCase(caseId);

          await caseDetailsPage.selectNextStep(
              ContestedEvents.generalApplicationDirections
          );

          await generalApplicationDirectionsPage.selectGeneralApplicationDirectionsHearing();
          await generalApplicationDirectionsPage.enterRecitals('Test');
          await generalApplicationDirectionsPage.selectJudge('District Judge');
          await generalApplicationDirectionsPage.enterJudgeName(
              'Tester Baggins'
          );
          await generalApplicationDirectionsPage.enterCourtOrderDate(
              '01',
              '07',
              '2025'
          );
          await generalApplicationDirectionsPage.enterDirectionFromJudge(
              'Test case'
          );

          await axeUtils.audit();

          await generalApplicationDirectionsPage.navigateContinue();
        });

        await test.step('Preview General Application directions order', async () => {
          await generalApplicationDirectionsPage.verifyGeneralApplicationDirectionPreviewLinkIsVisible();

          await axeUtils.audit();

          await generalApplicationDirectionsPage.navigateContinue();
        });

        await test.step('Submit General Application directions', async () => {
          await checkYourAnswersPage.assertCheckYourAnswersPage(
              contestedGeneralApplicationDirectionsTableData
          );

          await generalApplicationDirectionsPage.navigateSubmit();

          await caseDetailsPage.checkHasBeenUpdated(
              ContestedEvents.generalApplicationDirections.listItem
          );

          await caseDetailsPage.assertTabData(
              contestedGeneralApplicationTabData
          );
        });
      }
  );
});
