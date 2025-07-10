import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedEvents } from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';

const FILE_PATHS = {
  png: './playwright-e2e/resources/file/test.png',
  doc: './playwright-e2e/resources/file/test.doc',
  docx: './playwright-e2e/resources/file/test.docx',
  pdf: './playwright-e2e/resources/file/test.pdf',
  xlsx: './playwright-e2e/resources/file/test.xlsx',
  xls: './playwright-e2e/resources/file/test.xls'
};

test.describe('Contested - File Type Restrictions on uploading documents @flaky', () => {
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
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralApplication);

      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.doc);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.xls);

      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.docx);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.xlsx);

      await createGeneralApplicationPage.addNewSupportingDocument();
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.xls);
    }
  );
});
