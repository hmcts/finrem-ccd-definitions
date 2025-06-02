import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseDataHelper } from '../../helpers/Contested/ContestedCaseDataHelper';
import { ContestedEvents } from '../../../config/case-data';
import { caseFlagTabData } from '../../../data/tab_content/consented/case_flag_tabs';

test.describe('Contested Case Flag Tests', () => {
    test(
        'Contested - Caseworker creates case flag',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);

            // Helper function to create a flag
            async function createFlag(flagType: 'case' | 'applicant' | 'respondent', flagSelection: () => Promise<void>, comments: string) {
                await caseDetailsPage.selectNextStep(ContestedEvents.createFlag);
                await createFlagPage.selectFlagType(flagType);
                await createFlagPage.navigateContinue();
                await createFlagPage.navigateContinue();
                await createFlagPage.problemIfCaseFlagNotSelected();
                await flagSelection();
                await createFlagPage.navigateContinue();
                await createFlagPage.addCommentsToThisFlag(comments);
                await createFlagPage.navigateContinue();
                await createFlagPage.navigateSubmit();
                await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.createFlag.listItem);
                await caseDetailsPage.checkActiveCaseFlagOnCase();
            }

            // Create case flag
            await createFlag('case',
                () => createFlagPage.selectComplexCase(),
                "Test case"
            );

            // Create applicant flag
            await createFlag('applicant',
                () => createFlagPage.selectVulnerableUser(),
                "Test applicant"
            );

            // Create respondent flag
            await createFlag('respondent',
                () => createFlagPage.selectOther("Other Flag Type"),
                "Test respondent"
            );

            await caseDetailsPage.assertTabData(caseFlagTabData);

        }
    );
}
);
