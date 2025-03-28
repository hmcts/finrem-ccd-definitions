import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseWithEstimateAssetUnder1M } from '../../helpers/ExpressPilotHelper';
import { contestedEvents } from '../../../config/case_events';
import { updateCaseWorkerSteps } from '../../helpers/PayloadHelper';

async function createAndProcessPaperCase(): Promise<string> {
  const caseId = await createCaseWithEstimateAssetUnder1M(
    config.caseWorker.email,
    config.caseWorker.password,
    './playwright-e2e/data/payload/contested/paper_case/ccd-contested-base.json',
    'FinancialRemedyContested',
    'FR_newPaperCase'
  );
  return caseId;
}

test.describe('Contested - Paper Case - Amend application into Express Pilot', () => {
  test(
    'Should inform that the case will be enrolled into the Express Pilot',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        amendApplicationDetailsPage
      }
    ) => {
      const caseId = await createAndProcessPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.navigateContinue();
      await amendApplicationDetailsPage.verifyEstimatedAssetsLabelIsVisible();
    }
  );
});
