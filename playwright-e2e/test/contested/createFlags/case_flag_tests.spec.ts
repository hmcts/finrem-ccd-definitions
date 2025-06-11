import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/contested/ContestedCaseFactory';
import { caseFlagTabData } from '../../../resources/tab_content/common-tabs/case_flag_tabs';
import { caseFlagTabDataUpdated } from '../../../resources/tab_content/common-tabs/case_flag_tabs_updated';
import { createFlag, manageFlagOnce } from '../../../pages/helpers/CaseFlagHelper';

const caseFlagTestData = [
    {
        title: 'Caseworker creates case flag for Form A',
        setupCase: () => ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(),
        user: config.caseWorker,
    },
    {
        title: 'Judge creates case flag for Form A',
        setupCase: () => ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(),
        user: config.judge,
    },
    {
        title: 'Caseworker creates case flag for Paper Case',
        setupCase: () => ContestedCaseFactory.createAndSubmitPaperCase(),
        user: config.caseWorker,
    },
    {
        title: 'Caseworker creates case flag for Schedule1 Case',
        setupCase: () => ContestedCaseFactory.createAndProcessSchedule1CaseUpToIssueApplication(),
        user: config.caseWorker,
    },
];

test.describe('Contested Case Flag Tests', () => {
    for (const data of caseFlagTestData) {
        test(
            data.title,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage}) => {
                // Create and setup case
                const caseId = await data.setupCase();

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

                await caseDetailsPage.assertTabData(caseFlagTabData);

            }
        );
    }

    test(
    'Contested - Caseworker manage case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage }) => {
      // Create and setup case
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToCreateFlag();

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
        await manageCaseDashboardPage.navigateToCase(caseId);
        
      // Manage each flag individually
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'case', 'Complex Case', 'Test case');
        await manageFlagOnce(caseDetailsPage, manageFlagPage, 'applicant', 'Vulnerable user', 'Test applicant');
        await manageFlagOnce(caseDetailsPage, manageFlagPage, 'respondent', 'Other, Other Flag Type', 'Test respondent', false);

      // Assert Tab Data after all flags are managed
      await caseDetailsPage.assertTabData(caseFlagTabDataUpdated);
    }
    );
});
