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

const FILE_PATHS = {
  png: './playwright-e2e/data/test.png',
  doc: './playwright-e2e/data/test.doc',
  docx: './playwright-e2e/data/test.docx',
  pdf: './playwright-e2e/data/test.pdf',
  xlsx: './playwright-e2e/data/test.xlsx',
  xls: './playwright-e2e/data/test.xls'
};

test.describe('Contested - File Type Restrictions on uploading documents', () => {
  test(
    'Contested - Create Gneral Application - Allow only word, excel and pdf documents to be uploaded',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        createGeneralApplicationPage
      }
    ) => {
      const caseId = await createAndProcessPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      await caseDetailsPage.selectNextStep(contestedEvents.createGeneralApplication);

      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.doc);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.docx);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.xlsx);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.xls);

      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.doc);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.docx);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.xlsx);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.xls);

      await createGeneralApplicationPage.addNewSupportingDocument();
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.doc);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.docx);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.xlsx);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.xls);
    }
  );
});
