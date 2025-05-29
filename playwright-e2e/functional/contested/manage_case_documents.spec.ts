import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedCaseDataHelper } from '../helpers/Contested/ContestedCaseDataHelper';
import { ContestedEvents } from '../../config/case-data';

test.describe('Contested Manage Case Documents @test', () => {
    test(
        'Contested - Caseworker Manage Case Documents',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);
            /*
            // Add new document
            await manageCaseDocumentsPage.clickAddNew();
            await manageCaseDocumentsPage.uploadDocument('tests/assets/DummyDraftOrder.docx');
            await manageCaseDocumentsPage.selectDocumentType('Attendance Sheets');
            await manageCaseDocumentsPage.fillDescription('test case');
            await manageCaseDocumentsPage.setConfidentiality(true);
            await manageCaseDocumentsPage.continueAndSubmit();
            */
        }
    );
});
