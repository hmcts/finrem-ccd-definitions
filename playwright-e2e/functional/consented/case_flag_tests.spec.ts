import { test } from '../../fixtures/fixtures.ts';
import config from '../../config/config.ts';
import { caseFlagTabData } from '../../resources/tab_content/common-tabs/case_flag_tabs.ts';
import { caseFlagTabDataUpdated } from '../../resources/tab_content/common-tabs/case_flag_tabs_updated.ts';
import { createFlag, manageFlagOnce } from '../../pages/helpers/CaseFlagHelper.ts';
import { ConsentedCaseDataHelper } from '../data-utils/consented/ConsentedCaseDataHelper.ts';


const caseFlagTestData = [
    {
        createTitle: 'Caseworker creates case flag',
        manageTitle: 'Caseworker manages case flag',
        user: config.caseWorker,
    },
    {
        createTitle: 'Judge creates case flag',
        manageTitle: 'Judge manages case flag',
        user: config.judge,
    }
];

test.describe('Consented Case Flag Tests', () => {
    for (const data of caseFlagTestData) {
        test(
            'Consented - ' + data.createTitle,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage}) => {
                // Create and setup case
                const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToIssueApplication();

                // Login and navigate to case
                await manageCaseDashboardPage.visit();
                await loginPage.login(data.user.email, data.user.password, config.manageCaseBaseURL);
                await manageCaseDashboardPage.navigateToCase(caseId);

                // Create case flag
                await createFlag(caseDetailsPage, createFlagPage, 'case',
                    () => createFlagPage.selectComplexCase(),
                    "Test case"
                );

                // Create applicant flag
                await createFlag(caseDetailsPage, createFlagPage, 'applicant',
                    () => createFlagPage.selectVulnerableUser(),
                    "Test applicant"
                );

                // Create respondent flag
                await createFlag(caseDetailsPage, createFlagPage, 'respondent',
                    () => createFlagPage.selectOther("Other Flag Type"),
                    "Test respondent"
                );

                // Assert Tab Data
                await caseDetailsPage.assertTabData(caseFlagTabData);
            }
        );

        test(
            'Consented - ' + data.manageTitle,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage}) => {
                // Create and setup case
                const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToCreateFlag();

                // Login and navigate to case
                await manageCaseDashboardPage.visit();
                await loginPage.login(data.user.email, data.user.password, config.manageCaseBaseURL);
                await manageCaseDashboardPage.navigateToCase(caseId);

                // Manage each flag individually
                await manageFlagOnce(caseDetailsPage, manageFlagPage, 'case', 'Complex Case', 'Test case');
                await manageFlagOnce(caseDetailsPage, manageFlagPage, 'applicant', 'Vulnerable user', 'Test applicant');
                await manageFlagOnce(caseDetailsPage, manageFlagPage, 'respondent', 'Other, Other Flag Type', 'Test respondent', false);

                // Assert Tab Data after all flags are managed
                await caseDetailsPage.assertTabData(caseFlagTabDataUpdated);
            }
        );
    }
});
