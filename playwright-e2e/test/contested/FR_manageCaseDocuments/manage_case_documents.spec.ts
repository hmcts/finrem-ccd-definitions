import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { manageCaseDocumentsTable, manageCaseDocumentsTableNewConfidential, manageCaseDocumentsTableNewFdrDoc, manageCaseDocumentsTableSpecialTypeConfidential, manageCaseDocumentsTableWithoutPrejudice } from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';
import { DateHelper } from '../../../data-utils/DateHelper';
import { getConfidentialDocumentsTabData, getFdrDocumentsTabData, getSpecialTypeConfidentialDocumentsTabData, getWithoutPrejudiceDocumentsTabData } from '../../../resources/tab_content/contested/manage_case_documents_tabs';

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
        'Contested - Caseworker Manage Case Documents New event, Confidential Document Yes (Non-special types)',
        { tag: ['@firefox'] },
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
            await manageCaseDocumentsPage.uploadDocument('caseDoc.docx');
            await manageCaseDocumentsPage.selectDocumentType('Other'); 
            await manageCaseDocumentsPage.specifyDocumentTypeIfOther('test');
            await manageCaseDocumentsPage.fillDescription('test case');
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

     test ('Contested - Caseworker Manage Case Documents New event, Confidential Document No (FDR Document)',
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
            await manageCaseDocumentsPage.uploadDocument('fdrDoc.docx');
            await manageCaseDocumentsPage.selectDocumentType('Bill of Costs'); 
            await manageCaseDocumentsPage.fillDescription('fdr doc test');
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

     test  ('Contested - Caseworker Manage Case Documents New event, Confidential Document? Yes, special type',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, caseDetailsPage, axeUtils, checkYourAnswersPage, page }) => {
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
            await manageCaseDocumentsPage.uploadDocument('confidentialDoc.docx');
            await manageCaseDocumentsPage.selectDocumentType('Attendance Sheets'); 
            await manageCaseDocumentsPage.fillDescription('confidential special type test');
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

     test ('Contested - Manage Case Documents New event - WITHOUT_PREJUDICE_OFFERS',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageCaseDocumentsPage, checkYourAnswersPage, axeUtils, page }) => {
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
            await manageCaseDocumentsPage.uploadDocument('withoutPrejudice.docx');
            await manageCaseDocumentsPage.selectDocumentType('Without Prejudice offers'); 
            await manageCaseDocumentsPage.fillDescription('without prejudice test');
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
});
