import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {
    amendCaseDocumentsTable,
    manageCaseDocumentsTable,
    manageCaseDocumentsTableNewConfidential,
    manageCaseDocumentsTableNewFdrDoc,
    manageCaseDocumentsTableNewNonConfidential, manageCaseDocumentsTableNonConfidentialWitnessSummons,
    manageCaseDocumentsTableSpecialTypeConfidential,
    manageCaseDocumentsTableWithoutPrejudice
} from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';
import { DateHelper } from '../../../data-utils/DateHelper';
import { amendedDocumentTabData, getConfidentialDocumentsTabData, getFdrDocumentsTabData, getSpecialTypeConfidentialDocumentsTabData, getWithoutPrejudiceDocumentsTabData } from '../../../resources/tab_content/contested/manage_case_documents_tabs';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';

test.describe('Contested Manage Case Documents', () => {
  test(
    'Contested - Caseworker Manage Case Documents, adding non-confidential document',
    { tag: ['@caseworker'] },
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
      await manageCaseDocumentsPage.uploadCaseDocument('test.docx');
      await manageCaseDocumentsPage.selectDocument('Other');
      await manageCaseDocumentsPage.fillDocumentType('test document type');
      await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
      await manageCaseDocumentsPage.checkFdr(false);
      await manageCaseDocumentsPage.checkDocumentBehalfOfApplicant();
      await manageCaseDocumentsPage.navigateContinue();
      await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNewNonConfidential);
      await manageCaseDocumentsPage.navigateSubmit();
      await axeUtils.audit();
    }
  );

  test(
    'Contested - Super Caseworker Manage Case Documents New event, Confidential Document Yes (Non-special types)',
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
        await manageCaseDocumentsPage.uploadCaseDocument('test.docx');
        await manageCaseDocumentsPage.selectDocument('Other');
        await manageCaseDocumentsPage.fillDocumentType('test');
        await manageCaseDocumentsPage.checkConfidentiality('confidential');
        await manageCaseDocumentsPage.checkDocumentBehalfOfApplicant();
        await manageCaseDocumentsPage.navigateContinue();
        await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNewConfidential);
        await manageCaseDocumentsPage.navigateSubmit();
        await axeUtils.audit();
    }
  );

  test  ('Contested - Super Caseworker Manage Case Documents New event, non-confidential document, witness summons',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage, page }) => {
        // Create and setup case
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

        // Login as caseworker and navigate to case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
        await manageCaseDashboardPage.navigateToCase(caseId);

        // Manage case documents
        await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
        await manageCaseDocumentsPage.navigateAddNew();
        await manageCaseDocumentsPage.uploadCaseDocument('test.docx');
        await manageCaseDocumentsPage.selectDocument('Witness Summons');
        await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
        await manageCaseDocumentsPage.navigateContinue();
        await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNonConfidentialWitnessSummons);
        await manageCaseDocumentsPage.navigateSubmit();
        await axeUtils.audit();
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
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.amendDoc();
      await expect(page.getByRole('button', { name: 'caseDoc.docx' })).toBeVisible();
      await manageCaseDocumentsPage.uploadDocument('test.docx');
        await manageCaseDocumentsPage.selectDocument('Witness Summons');
        await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
        await manageCaseDocumentsPage.navigateContinue();
        await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNonConfidentialWitnessSummons);
        await manageCaseDocumentsPage.navigateSubmit();
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
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.amendDoc();
      //expect original document to be visible
      await expect(page.getByRole('button', { name: 'caseDoc.docx' })).toBeVisible();
      await manageCaseDocumentsPage.removeDocument();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocuments.listItem);
      await caseDetailsPage.assertDocumentVisibleInCfv('caseDoc.docx', false);
    }
  );
});
