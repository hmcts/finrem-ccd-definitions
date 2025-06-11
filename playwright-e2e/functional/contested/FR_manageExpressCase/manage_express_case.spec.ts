import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseDataHelper } from '../../../data-utils/contested/ContestedCaseDataHelper';

test.describe('Contested - Manage Express Case', () => {
  test(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
      const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication(true);

      // Navigate to case and assert initial tab data
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }]);

      // Remove case from express pilot
      await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
      await manageExpressCasePage.selectExpressPilotQuestionNo();
      await manageExpressCasePage.uncheckConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await manageExpressCasePage.verifyFieldIsRequiredMessageShown();
      await manageExpressCasePage.checkConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }]);
    }
  );

  test(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
      const caseId = await ContestedCaseDataHelper.createAndSubmitPaperCase(true);

      // Navigate to case and assert initial tab data
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Enrolled'] }]);

      // Remove case from express pilot
      await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
      await manageExpressCasePage.selectExpressPilotQuestionNo();
      await manageExpressCasePage.uncheckConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await manageExpressCasePage.verifyFieldIsRequiredMessageShown();
      await manageExpressCasePage.checkConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }]);
    }
  );

  test(
    'Contested - Not qualified case (Form A Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
      const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication(false);

      // Navigate to case and assert initial tab data
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }]);

      // Verify not enrolled message
      await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
      await manageExpressCasePage.verifyExpressPilotNotEnrolled();
      await manageExpressCasePage.navigateSubmit();
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }]);
    }
  );

  test(
    'Contested - Not qualified case (Paper Case) - Show not enrolled message',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
      const caseId = await ContestedCaseDataHelper.createAndSubmitPaperCase(false);

      // Navigate to case and assert initial tab data
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }]);

      // Verify not enrolled message
      await caseDetailsPage.selectNextStep(ContestedEvents.manageExpressCase);
      await manageExpressCasePage.verifyExpressPilotNotEnrolled();
      await manageExpressCasePage.navigateSubmit();
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }]);
    }
  );
});
