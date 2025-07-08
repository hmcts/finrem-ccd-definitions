import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { createGeneralApplicationTableData } from '../../../resources/check_your_answer_content/create_general_application/createGeneralApplication';

test.describe('Contested Create Send Order to an applicant solicitor', () => {
    test(
        'Contested - Send Order to an applicant solicitor @test',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createGeneralApplicationPage, checkYourAnswersPage, prepareForHearingPage, createGeneralOrderPage, contestedSendOrderPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Create general application
            await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralApplication);
            await createGeneralApplicationPage.selectHearing(true);
            await createGeneralApplicationPage.fillTimeEstimate('5');
            await createGeneralApplicationPage.uploadGeneralDocument('./playwright-e2e/resources/file/test.docx');
            await createGeneralApplicationPage.navigateContinue();

            // Check you answers - general application
            //await checkYourAnswersPage.assertCheckYourAnswersPage(createGeneralApplicationTableData);
            await createGeneralApplicationPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.createGeneralApplication.listItem);

            // Prepare for hearing
            await caseDetailsPage.selectNextStep(ContestedEvents.prepareForHearing);
            await prepareForHearingPage.navigateSubmit();

            // Create general order
            await caseDetailsPage.selectNextStep(ContestedEvents.createGeneralOrder);
            await createGeneralOrderPage.clickJudgeButton();
            await createGeneralOrderPage.selectJudge('District Judge');
            await createGeneralOrderPage.fillDescription('test case');
            await createGeneralOrderPage.navigateContinue();
            // could add assertion in here
            await createGeneralOrderPage.navigateContinue();
            // could add check your answers here
            await createGeneralOrderPage.navigateSubmit();

            // Send order
            await caseDetailsPage.selectNextStep(ContestedEvents.contestedSendOrder);
        }
    );
});