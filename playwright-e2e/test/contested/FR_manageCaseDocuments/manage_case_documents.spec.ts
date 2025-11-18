import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { manageCaseDocumentsTable, manageCaseDocumentsTableNew } from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';
import { DateHelper } from '../../../data-utils/DateHelper';
import { getFdrDocumentsTabData } from '../../../resources/tab_content/contested/fdr_documents_tabs';

test.describe('Contested Manage Case Documents', () => {
    test(
        'Contested - Caseworker Manage Case Documents',
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
            await manageCaseDocumentsPage.uploadDocument('./playwright-e2e/resources/file/test.docx');
            await manageCaseDocumentsPage.selectDocumentType('Other'); 
            await manageCaseDocumentsPage.specifyDocumentTypeIfOther('test');
            await manageCaseDocumentsPage.fillDescription('test case'); 
            await manageCaseDocumentsPage.checkConfidentialityGuideText();
            await manageCaseDocumentsPage.isThisAnFdrDocument(true);
            await axeUtils.audit();

            //Continue about to submit and check your answers
            await manageCaseDocumentsPage.navigateContinue();
            await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTable);
            await manageCaseDocumentsPage.navigateSubmit();
        }
    );
     test(
        'Contested - Caseworker Manage Case Documents New event',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);
            
            // Manage case documents
            await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsNewEvent);
            await manageCaseDocumentsPage.addNew();
            await manageCaseDocumentsPage.navigateContinue();
            await manageCaseDocumentsPage.uploadDocument('./playwright-e2e/resources/file/test.docx');
            await manageCaseDocumentsPage.selectDocumentType('Other'); 
            await manageCaseDocumentsPage.specifyDocumentTypeIfOther('test');
            await manageCaseDocumentsPage.fillDescription('test case');
            await manageCaseDocumentsPage.checkConfidentialityGuideText();
            await manageCaseDocumentsPage.isDocumentConfidential(false);
            await manageCaseDocumentsPage.isThisAnFdrDocument(true);
            await manageCaseDocumentsPage.documentOnBehalfOf(0, 'Case');
            await axeUtils.audit();

            //Continue about to submit and check your answers
            await manageCaseDocumentsPage.navigateContinue();
            await checkYourAnswersPage.assertCheckYourAnswersPage(manageCaseDocumentsTableNew);
            await manageCaseDocumentsPage.navigateSubmit();
            const uploadDateTime = DateHelper.getUtcDateTimeFormatted();


            //FDR documents tab assertion
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocumentsNewEvent.listItem);
            await caseDetailsPage.assertTabData([getFdrDocumentsTabData(uploadDateTime)]);
         }
     );
});
