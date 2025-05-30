import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedCaseDataHelper } from '../helpers/Contested/ContestedCaseDataHelper';
import { ContestedEvents } from '../../config/case-data';
import { BaseJourneyPage } from '../../pages/BaseJourneyPage';
import { ManageCaseDocumentsPage } from '../../pages/events/manage-case-documents/ManageCaseDocumentsPage';

test.describe('Contested Manage Case Documents @test', () => {
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
            await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocumentsPage);
            await manageCaseDocumentsPage.navigateAddNew(); 
            await manageCaseDocumentsPage.uploadDocument('playwright-e2e/data/test.docx'); 
            await manageCaseDocumentsPage.selectDocumentType('Attendance Sheets'); // see if there is a base journey method
            await manageCaseDocumentsPage.fillDescription('test case'); // see if there is a base journey method
            await manageCaseDocumentsPage.setConfidentiality(true); //change to basejouney method

            //Continue about to submit and check your answers
            await manageCaseDocumentsPage.navigateSubmit();
        }
    );
});
