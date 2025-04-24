import { expect, test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CaseDataHelper } from '../helpers/CaseDataHelper';
import { contestedEvents } from '../../config/case_events';
import { PayloadHelper } from '../helpers/PayloadHelper';

async function createAndProcessPaperCase(): Promise<string> {
  const caseId = await CaseDataHelper.createBaseContestedPaperCase();
  await PayloadHelper.caseWorkerSubmitPaperCase(caseId);
  return caseId;
}

test.describe('Contested - File Type Restrictions on uploading documents', () => {
  test(
    'Contested - Create Gneral Application - Allow only word documents and pdf documents to be uploaded',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        createGeneralApplicationPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await createAndProcessPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(contestedEvents.createGeneralApplication);
      await createGeneralApplicationPage.uploadDraftOrder('./playwright-e2e/data/test.png', false);
      await createGeneralApplicationPage.uploadDraftOrder('./playwright-e2e/data/test.doc');
      await createGeneralApplicationPage.uploadDraftOrder('./playwright-e2e/data/test.docx');
    }
  );
});
