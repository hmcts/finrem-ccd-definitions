import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';

test.describe('Contested - Paper Case - Amend application into Express Pilot', () => {
  test(
    'Enrollment message dynamic page should be inserted when changing total value of assets',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendPaperApplicationDetailsPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createContestedPaperCaseWithEstimatedAssetUnder1M();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £1 million'] }]);
    
      await caseDetailsPage.selectNextStep(ContestedEvents.amendPaperApplicationDetails);

      for (let i = 0; i < 8; i++) {
        await amendPaperApplicationDetailsPage.navigateContinue();
      }
      await amendPaperApplicationDetailsPage.verifyEstimatedAssetsLabelIsVisible();
      await amendPaperApplicationDetailsPage.selectUnder250k();
      await amendPaperApplicationDetailsPage.enterEstimatedAssets('6894');
      await amendPaperApplicationDetailsPage.navigateContinue();
      await amendPaperApplicationDetailsPage.navigateContinue();
      await amendPaperApplicationDetailsPage.verifyDynamicEnrollmentMessageIsVisible();
    }
  );

  test(
    'Enrollment message dynamic page should be inserted when participating court is changed',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendPaperApplicationDetailsPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createBaseContestedPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
      await caseDetailsPage.selectNextStep(ContestedEvents.amendPaperApplicationDetails);
      for (let i = 0; i < 9; i++) {
        await amendPaperApplicationDetailsPage.navigateContinue();
      }
      await amendPaperApplicationDetailsPage.selectParticipatingCourt();
      await amendPaperApplicationDetailsPage.navigateContinue(); 
      await amendPaperApplicationDetailsPage.verifyDynamicEnrollmentMessageIsVisible();
    }
  );

  test(
    'Exiting express pilot message dynamic page should be inserted when changing total value of assets',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendPaperApplicationDetailsPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createContestedPaperCaseWithExpressPilotEnrolled();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
    
      await caseDetailsPage.selectNextStep(ContestedEvents.amendPaperApplicationDetails);
      for (let i = 0; i < 8; i++) {
        await amendPaperApplicationDetailsPage.navigateContinue();
      }
      await amendPaperApplicationDetailsPage.verifyEstimatedAssetsLabelIsVisible();
      await amendPaperApplicationDetailsPage.selectUnder1M();
      await amendPaperApplicationDetailsPage.enterEstimatedAssets('999999');
      await amendPaperApplicationDetailsPage.navigateContinue();
      await amendPaperApplicationDetailsPage.navigateContinue();
      await amendPaperApplicationDetailsPage.verifyDynamicExistingExpressPilotMessageIsVisible();
    }
  );

  test(
    'Exiting express pilot message dynamic page should be inserted when participating court is changed',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendPaperApplicationDetailsPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createContestedPaperCaseWithExpressPilotEnrolled();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
    
      await caseDetailsPage.selectNextStep(ContestedEvents.amendPaperApplicationDetails);
      for (let i = 0; i < 9; i++) {
        await amendPaperApplicationDetailsPage.navigateContinue();
      }
      await amendPaperApplicationDetailsPage.selectNonParticipatingCourt();
      await amendPaperApplicationDetailsPage.navigateContinue(); 
      await amendPaperApplicationDetailsPage.verifyDynamicExistingExpressPilotMessageIsVisible();
    }
  );
});
