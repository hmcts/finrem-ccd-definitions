import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedCaseDataHelper} from "../../helpers/Contested/ContestedCaseDataHelper.ts";
import {ContestedEvents} from "../../../config/case-data.ts";

test.describe('Contested - Manage Hearings', () => {
    test(
        'Contested - Caseworker manages hearings for Form A case',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Manage hearings
            await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
            await manageHearingPage.selectAddANewHearing();
            await manageHearingPage.navigateContinue();

            /*await manageHearingPage.addHearing({
                type: 'Final Hearing',
                duration: '2 hours',
                date: { day: '15', month: '10', year: '2023' },
                time: '10:00',
                information: 'Hearing details here',
                court: 'Court Name',
                file: undefined
            });
            await manageHearingPage.submitHearing();*/
            await caseDetailsPage.checkHasBeenUpdated('Manage Hearings');
        }
    )

}
);