import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';

test.describe('Contested - Manage Express Case', () => {
  test(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage, axeUtils }) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(true);

      await test.step('Navigate to case and verify enrolled status', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] },
        ]);
      });

      await test.step('Remove case from express pilot and verify withdrawn status', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] },
        ]);
      });
    }
  );

  test(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase(true);

      await test.step('Navigate to case and verify enrolled status', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] },
        ]);
      });

      await test.step('Remove case from express pilot and verify withdrawn status', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] },
        ]);
      });
    }
  );

  test(
    'Contested - Not qualified case (Form A Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage }) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false);

      await test.step('Navigate to case and verify not qualified status', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] },
        ]);
      });

      await test.step('Attempt manage express case and verify not enrolled message', async () => {
        await caseDetailsPage.selectNextStepAndExpectErrorMessage(
          ContestedEvents.manageExpressCase,
          'This case is not enrolled in the Express Financial Remedy Pilot and does meet the criteria to be enrolled'
        );
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] },
        ]);
      });
    }
  );

  test(
    'Contested - Not qualified case (Paper Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage }) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase(false);

      await test.step('Navigate to case and verify not qualified status', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] },
        ]);
      });

      await test.step('Attempt manage express case and verify not enrolled message', async () => {
        await caseDetailsPage.selectNextStepAndExpectErrorMessage(
          ContestedEvents.manageExpressCase,
          'This case is not enrolled in the Express Financial Remedy Pilot and does meet the criteria to be enrolled'
        );
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] },
        ]);
      });
    }
  );
});
