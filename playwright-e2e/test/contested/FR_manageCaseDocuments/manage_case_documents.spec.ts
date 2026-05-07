import {expect, test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedEvents} from '../../../config/case-data';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {
  amendCaseDocumentsTable,
  manageCaseDocumentsTable,
  manageCaseDocumentsTableNewConfidential,
  manageCaseDocumentsTableNewFdrDoc,
  manageCaseDocumentsTableSpecialTypeConfidential,
  manageCaseDocumentsTableWithoutPrejudice
} from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';
import {DateHelper} from '../../../data-utils/DateHelper';
import {
  amendedDocumentTabData,
  getConfidentialDocumentsTabData,
  getFdrDocumentsTabData,
  getSpecialTypeConfidentialDocumentsTabData,
  getWithoutPrejudiceDocumentsTabData
} from '../../../resources/tab_content/contested/manage_case_documents_tabs';
import {ContestedEventApi} from '../../../data-utils/api/contested/ContestedEventApi';
import {DocumentClient, DocumentMetadata} from '../../../data-utils/api/DocumentClient.ts';
import {CaseTab} from '../../../pages/ManageCaseDashboardPage.ts';
import {Locator} from '@playwright/test';

test.describe('Contested Manage Case Documents', () => {
  test(
    'Contested - Caseworker Manage Case Documents (Legacy Event)',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
            
      // Manage case documents
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.navigateAddNew(); 
      await manageCaseDocumentsPage.legacyUploadDocument('test.docx');
      await manageCaseDocumentsPage.legacySelectDocumentType('Other');
      await manageCaseDocumentsPage.legacySpecifyDocumentTypeIfOther('test');
      await manageCaseDocumentsPage.legacyFillDescription('test case');
      await manageCaseDocumentsPage.checkConfidentialityGuideText();
      await manageCaseDocumentsPage.legacyIsDocumentConfidential(true);
      await axeUtils.audit();

      //Continue about to submit and check your answers
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTable);
      await manageCaseDocumentsPage.navigateSubmit();
    }
  );

  test(
    'Contested - Super Caseworker Manage Case Documents New event, Confidential Document Yes (Non-special types)',
    { tag: ['@firefox'] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.addNew();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.uploadDocument('caseDoc.docx');
      await manageCaseDocumentsPage.selectDocumentType('Other');
      await manageCaseDocumentsPage.specifyDocumentTypeIfOther('test');
      await manageCaseDocumentsPage.checkConfidentialityGuideText();
      await manageCaseDocumentsPage.isDocumentConfidential(true);
      await manageCaseDocumentsPage.documentOnBehalfOf(0, 'Applicant');
      await axeUtils.audit();

      //Continue about to submit and check your answers
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNewConfidential);
      await manageCaseDocumentsPage.navigateSubmit();
      const uploadDateTime = DateHelper.getUtcDateTimeFormatted();


      //FDR documents tab assertion
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertTabData([getConfidentialDocumentsTabData(uploadDateTime)]);
    }
  );

  test ('Contested - Super Caseworker Manage Case Documents New event, Confidential Document No (FDR Document)',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.addNew();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.uploadDocument('fdrDoc.docx');
      await manageCaseDocumentsPage.selectDocumentType('Bill of Costs');
      await manageCaseDocumentsPage.checkConfidentialityGuideText();
      await manageCaseDocumentsPage.isDocumentConfidential(false);
      await manageCaseDocumentsPage.isThisAnFdrDocument(true);
      await manageCaseDocumentsPage.documentOnBehalfOf(0, 'Respondent');
      await axeUtils.audit();

      //Continue about to submit and check your answers
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNewFdrDoc);
      await manageCaseDocumentsPage.navigateSubmit();
      const uploadDateTime = DateHelper.getUtcDateTimeFormatted();

      //FDR documents tab assertion
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertTabData([getFdrDocumentsTabData(uploadDateTime)]);
    }
  );

  test  ('Contested - Super Caseworker Manage Case Documents New event, Confidential Document? Yes, special type',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage, page }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.addNew();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.uploadDocument('confidentialDoc.docx');
      await manageCaseDocumentsPage.selectDocumentType('Attendance Sheets');
      await manageCaseDocumentsPage.checkConfidentialityGuideText();
      await manageCaseDocumentsPage.isDocumentConfidential(true);
      // FDR question and Document on behalf should be hidden for certain document types
      await expect(manageCaseDocumentsPage.isThisFdrDocumentQuestion).toBeHidden();
      await expect(page.getByText('Document on behalf of?')).toBeHidden();
      await axeUtils.audit();

      //Continue about to submit and check your answers
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableSpecialTypeConfidential);
      await manageCaseDocumentsPage.navigateSubmit();
      const uploadDateTime = DateHelper.getUtcDateTimeFormatted();
      // Confidential documents tab assertion
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertTabData([getSpecialTypeConfidentialDocumentsTabData(uploadDateTime)]);
    }
  );

  test ('Contested - Super Caseworker Manage Case Documents New event - WITHOUT_PREJUDICE_OFFERS',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageCaseDocumentsPage, checkYourAnswersPage, axeUtils, page }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.addNew();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.uploadDocument('withoutPrejudice.docx');
      await manageCaseDocumentsPage.selectDocumentType('Without Prejudice offers');
      // Confidentiality question, FDR question and Document on behalf should be hidden for Without Prejudice offers document type
      await expect(page.getByText('Is the document confidential?')).toBeHidden();
      await expect(manageCaseDocumentsPage.isThisFdrDocumentQuestion).toBeHidden();
      await expect(page.getByText('Document on behalf of?')).toBeHidden();
      await axeUtils.audit();

      //Continue about to submit and check your answers
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableWithoutPrejudice);
      await manageCaseDocumentsPage.navigateSubmit();
      const uploadDateTime = DateHelper.getUtcDateTimeFormatted();
      // Confidential documents tab assertion
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertTabData([getWithoutPrejudiceDocumentsTabData(uploadDateTime)]);
    }
  );

  test('Contested - Super Caseworker Manage Case Documents New event, amend existing documents', 
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, page, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents - amend document
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.amendDoc();
      await manageCaseDocumentsPage.navigateContinue();
      //expect original document to be visible
      await expect(page.getByRole('button', { name: 'caseDoc.docx' })).toBeVisible();
      await manageCaseDocumentsPage.uploadDocument('amendedDoc.docx');
      await manageCaseDocumentsPage.selectDocumentType('Witness Summons');
      await manageCaseDocumentsPage.checkConfidentialityGuideText();
      await manageCaseDocumentsPage.isDocumentConfidential(false);
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(amendCaseDocumentsTable);
      await manageCaseDocumentsPage.navigateSubmit();
      // Case documents tab assertion
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertTabData([amendedDocumentTabData()]);
      await caseDetailsPage.assertDocumentVisibleInCfv('caseDoc.docx', false);
    }
  );

  test('Contested - Super Caseworker Manage Case Documents New event, amend event, delete existing document', 
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, page, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents - amend document
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
      await manageCaseDocumentsPage.amendDoc();
      await manageCaseDocumentsPage.navigateContinue();
      //expect original document to be visible
      await expect(page.getByRole('button', { name: 'caseDoc.docx' })).toBeVisible();
      await manageCaseDocumentsPage.removeDocument();
      await expect(page.getByRole('button', { name: 'caseDoc.dox'})).toBeHidden({ timeout: 200 });
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
      await caseDetailsPage.assertDocumentVisibleInCfv('caseDoc.docx', false);
    }
  );

  test('Contested - Document deletion removes reference from Case Data', async ({
    page,
    manageCaseDashboardPage,
    loginPage,
    caseDetailsPage,
    manageCaseDocumentsPage
  }): Promise<void> => {
    let documentId: string;
    let cookieHeader: string;
    let caseId: string;

    const filename: string = 'caseDoc.docx';

    await test.step('Create case and seed document', async (): Promise<void> => {
      caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);
    });

    await test.step('Login and navigate to case', async ():Promise<void> => {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        config.superCaseWorker.email,
        config.superCaseWorker.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );
    });

    await test.step('Capture document ID from case data', async (): Promise<void> => {
      const responsePromise = page.waitForResponse(res =>
      {return res.url().includes('/data/internal/cases/') &&
                res.status() === 200;}
      );

      await manageCaseDashboardPage.navigateToCase(caseId);

      await manageCaseDashboardPage.navigateToTab(CaseTab.ConfDocuments);

      const documentButton: Locator = page.getByRole('button', { name: filename });

      await expect(documentButton).toBeVisible();

      const response = await responsePromise;
      const caseData: JSON = await response.json();

      const raw: string = JSON.stringify(caseData);

      const match: RegExpMatchArray | null = raw.match(/documents\/([a-f0-9-]+)\/binary/);

      expect(match).toBeTruthy();

      documentId = match![1];

      const cookies = await page.context().cookies();
      cookieHeader = cookies.map(c => {return `${c.name}=${c.value}`;}).join('; ');
    });

    await test.step('Verify document exists before deletion', async (): Promise<void> => {
      const documentClient = new DocumentClient(
        config.superCaseWorker.email,
        config.superCaseWorker.password
      );

      const metadata: DocumentMetadata = await documentClient.getDocumentCookies(documentId, cookieHeader);

      expect(metadata).toBeTruthy();
      expect(metadata._links.self.href).toContain(documentId);
    });

    await test.step('Delete the document via UI', async (): Promise<void> => {
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);

      await manageCaseDocumentsPage.amendDoc();
      await manageCaseDocumentsPage.navigateContinue();

      await manageCaseDocumentsPage.removeDocument();
    });

    await test.step('Submit event and verify response', async (): Promise<void> => {
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();
    });

    await test.step('Re-fetch case data and assert document reference removed', async (): Promise<void> => {

      await manageCaseDashboardPage.navigateToTab(CaseTab.CaseDocuments);

      const documentButton = page.getByRole('button', { name: filename});

      const noDocuments: number = 0;

      await expect(documentButton).toHaveCount(noDocuments);
    });
  });
});
