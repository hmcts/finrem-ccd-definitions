import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseDataHelper } from '../../data-utils/contested/ContestedCaseDataHelper';

test.describe('Contested Manage Case Documents', () => {
    test(
        'Contested - Caseworker Manage Case Documents',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);
            
            // Manage case documents
            await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
            await manageCaseDocumentsPage.navigateAddNew(); 
            await manageCaseDocumentsPage.uploadDocument('./playwright-e2e/resources/file/test.docx');
            await manageCaseDocumentsPage.selectDocumentType('Other'); 
            await manageCaseDocumentsPage.specifyDocumentType('test');
            await manageCaseDocumentsPage.fillDescription('test case'); 
            await manageCaseDocumentsPage.checkConfidentiality();
            await manageCaseDocumentsPage.setConfidentiality(true); 

            //Continue about to submit and check your answers
            await manageCaseDocumentsPage.navigateContinue();
            await manageCaseDocumentsPage.checkAnswersPage();
            await manageCaseDocumentsPage.navigateSubmit();
        }
    );
});
