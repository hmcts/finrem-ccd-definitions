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

//This test is currently flaky due to doc uploads rate limiting and needs to be fixed before re-enabling
test.describe.skip('Contested - File Type Restrictions on uploading documents', () => { 
  test(
    'Contested - Create General Application - Allow only word, excel and pdf documents to be uploaded as Draft Order',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      createGeneralApplicationPage
    }) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralApplication);

      // Test allowed and disallowed file types for Draft Order
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.doc);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadDraftOrder(FILE_PATHS.xls);
    }
  );

  test(
    'Contested - Create General Application - Allow only word, excel and pdf documents to be uploaded as General Application',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      createGeneralApplicationPage
    }) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralApplication);

      // Test allowed and disallowed file types for General Application
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.docx);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadGeneralApplication(FILE_PATHS.xlsx);
    }
  );

  test(
    'Contested - Create General Application - Allow only word, excel and pdf documents to be uploaded as Supporting Document',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      createGeneralApplicationPage
    }) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralApplication);

      await createGeneralApplicationPage.addNewSupportingDocument();
      // Test allowed and disallowed file types for Supporting Document
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.png, false);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.pdf);
      await createGeneralApplicationPage.uploadFirstSupportingDocument(FILE_PATHS.xls);
    }
  );
});
