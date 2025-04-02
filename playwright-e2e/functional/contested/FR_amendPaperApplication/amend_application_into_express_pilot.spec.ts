import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ExpressPilotHelper } from '../../helpers/ExpressPilotHelper';
import { contestedEvents } from '../../../config/case_events';

test.describe('Contested - Paper Case - Amend application into Express Pilot', () => {
  test(
    'Enrollment message dynamic page should be inserted when changing total value of assets',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendApplicationDetailsPage
      }
    ) => {
      const caseId = await ExpressPilotHelper.createContestedPaperCaseWithEstimatedAssetUnder1M();
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £1 million'] }]);
    
      await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
      for (let i = 0; i < 8; i++) {
        await amendApplicationDetailsPage.navigateContinue();
      }
      await amendApplicationDetailsPage.verifyEstimatedAssetsLabelIsVisible();
      await amendApplicationDetailsPage.selectUnder250k();
      await amendApplicationDetailsPage.enterEstimatedAssets('6894');
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.verifyDynamicEnrollmentMessageIsVisible();
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
        amendApplicationDetailsPage
      }
    ) => {
      const caseId = await ExpressPilotHelper.createContestedPaperCaseWithNonParticipatingCourt();
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
    
      await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
      for (let i = 0; i < 9; i++) {
        await amendApplicationDetailsPage.navigateContinue();
      }
      await amendApplicationDetailsPage.selectParticipatingCourt();
      await amendApplicationDetailsPage.navigateContinue(); 
      await amendApplicationDetailsPage.verifyDynamicEnrollmentMessageIsVisible();
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
        amendApplicationDetailsPage
      }
    ) => {
      const caseId = await ExpressPilotHelper.createContestedPaperCaseWithExpressPilotEnrolled();
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
    
      await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
      for (let i = 0; i < 8; i++) {
        await amendApplicationDetailsPage.navigateContinue();
      }
      await amendApplicationDetailsPage.verifyEstimatedAssetsLabelIsVisible();
      await amendApplicationDetailsPage.selectUnder1M();
      await amendApplicationDetailsPage.enterEstimatedAssets('999999');
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.verifyDynamicExistingExpressPilotMessageIsVisible();
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
        amendApplicationDetailsPage
      }
    ) => {
      const caseId = await ExpressPilotHelper.createContestedPaperCaseWithExpressPilotEnrolled();
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['The net assets in this case are currently estimated to be in the order of Under £250,000 (this should be total of combined net assets, but excluding pensions)'] }]);
    
      await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
      for (let i = 0; i < 9; i++) {
        await amendApplicationDetailsPage.navigateContinue();
      }
      await amendApplicationDetailsPage.selectNonParticipatingCourt();
      await amendApplicationDetailsPage.navigateContinue(); 
      await amendApplicationDetailsPage.verifyDynamicExistingExpressPilotMessageIsVisible();
    }
  );
});
