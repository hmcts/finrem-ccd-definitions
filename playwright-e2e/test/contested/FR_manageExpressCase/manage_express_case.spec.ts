import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';

test.describe('Contested - Manage Express Case', () => {
  test(
    'Contested - Qualified case (Form A Case) - Enroll a case to express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage, axeUtils }) => {
      let caseId: string;

      await test.step('Create Form A qualified case', async () => {
        caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(true);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });

      await test.step('Remove case from express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }
        ]);
      });

      await test.step('Re-enroll case into express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionYes();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });
    }
  );

  test(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage, axeUtils }) => {
      let caseId: string;

      await test.step('Create Form A enrolled case', async () => {
        caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(true);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });

      await test.step('Remove case from express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }
        ]);
      });
    }
  );

  test(
    'Contested - Qualified case (Paper Case) - Enroll a case to express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage, axeUtils }) => {
      let caseId: string;

      await test.step('Create Paper qualified case', async () => {
        caseId = await ContestedCaseFactory.createAndSubmitPaperCase(true);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });

      await test.step('Remove case from express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }
        ]);
      });

      await test.step('Re-enroll case into express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionYes();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });
    }
  );

  test(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage, axeUtils }) => {
      let caseId: string;

      await test.step('Create Paper enrolled case', async () => {
        caseId = await ContestedCaseFactory.createAndSubmitPaperCase(true);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }
        ]);
      });

      await test.step('Remove case from express pilot', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
        await manageExpressCasePage.selectExpressPilotQuestionNo();
        await axeUtils.audit();
        await manageExpressCasePage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }
        ]);
      });
    }
  );

  test(
    'Contested - Not qualified case (Form A Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage }) => {
      let caseId: string;

      await test.step('Create Form A non-qualifying case', async () => {
        caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }
        ]);
      });

      await test.step('Attempt to manage express case and expect error message', async () => {
        await caseDetailsPage.selectNextStepAndExpectErrorMessage(
          ContestedEvents.manageExpressCase,
          'This case is not enrolled in the Express Financial Remedy Pilot and does meet the criteria to be enrolled'
        );
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }
        ]);
      });
    }
  );

  test(
    'Contested - Not qualified case (Paper Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage }) => {
      let caseId: string;

      await test.step('Create Paper non-qualifying case', async () => {
        caseId = await ContestedCaseFactory.createAndSubmitPaperCase(false);
      });

      await test.step('Navigate to case and assert initial tab data', async () => {
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
        await manageCaseDashboardPage.navigateToCase(caseId);
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }
        ]);
      });

      await test.step('Attempt to manage express case and expect error message', async () => {
        await caseDetailsPage.selectNextStepAndExpectErrorMessage(
          ContestedEvents.manageExpressCase,
          'This case is not enrolled in the Express Financial Remedy Pilot and does meet the criteria to be enrolled'
        );
        await caseDetailsPage.assertTabData([
          { tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }
        ]);
      });
    }
  );
});
