import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';

test.describe('Contested General Application e2e', () => {
    test(
        'Contested - General Application e2e @test',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createGeneralApplicationPage, referToJudgeApplicationPage, generalApplicationOutcomePage }) => {
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
            await createGeneralApplicationPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.createGeneralApplication.listItem);

            // Refer general application
            await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationReferToJudge);
            await referToJudgeApplicationPage.navigateContinue();
            await referToJudgeApplicationPage.navigateSubmit();

            // General application outcome
            await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationOutcome);
            await generalApplicationOutcomePage.selectGeneralApplicationOutcome();
            await generalApplicationOutcomePage.navigateContinue();
            await generalApplicationOutcomePage.navigateSubmit();
        }
    );
});
