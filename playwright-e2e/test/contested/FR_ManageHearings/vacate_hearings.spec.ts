import {test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';

test.describe('Contested - Vacate Hearings', () => {

    test('Contested - Vacate Hearing Option Available',
        { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage }) => {
            // Create and setup case up to issue application
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            //navigate to manage hearings event
            await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);

            //assert that vacate hearing option is available
            await manageHearingPage.validateVacateHearingOptionAvailable();
        });
});
