import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseDataHelper } from '../../helpers/Contested/ContestedCaseDataHelper';
import { caseFlagTabData } from '../../../data/tab_content/common-tabs/case_flag_tabs';
import { caseFlagTabDataUpdated } from '../../../data/tab_content/common-tabs/case_flag_tabs_updated';
import { createFlag, manageFlagOnce } from '../../helpers/CommonHelpers/CaseFlagHelper';

test.describe('Contested Case Flag Tests for Form A', () => {
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

    test(
    'Contested - Caseworker manage case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage }) => {
      // Create and setup case
        const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToCreateFlag();

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
    
    test(
        'Contested - Judge creates case flag',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
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
);

test.describe('Contested Case Flag Tests for Paper Case', () => {
    test(
        'Contested - Caseworker creates case flag for Paper Case',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndSubmitPaperCase();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
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
);

test.describe('Contested Case Flag Tests for Schedule1 Case', () => {
    test(
        'Contested - Caseworker creates case flag for Schedule1 Case',
        { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
            // Create and setup case
            const caseId = await ContestedCaseDataHelper.createAndProcessSchedule1CaseUpToIssueApplication();

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
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
);
