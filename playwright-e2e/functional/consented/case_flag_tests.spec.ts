import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';
import { ConsentedEvents } from '../../config/case-data';
import { caseFlagTabData } from '../../data/tab_content/common-tabs/case_flag_tabs';
import { caseFlagTabDataUpdated } from '../../data/tab_content/common-tabs/case_flag_tabs_updated';
import { createFlag, manageFlagOnce } from '../helpers/CommonHelpers/CaseFlagHelper';

test.describe('Consented Case Flag Tests as a caseworker', () => {
  test(
    'Consented - Caseworker creates case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
      // Create and setup case
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToIssueApplication();

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

      // Assert Tab Data      
      await caseDetailsPage.assertTabData(caseFlagTabData);
    }
  );

  test(
    'Consented - Caseworker manage case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage }) => {
      // Create and setup case
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToCreateFlag();

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

test.describe('Consented Case Flag Tests as a judge @test', () => {
  test(
    'Consented - judge creates case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
      // Create and setup case
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToIssueApplication();

      // Login as judge and navigate to case
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

      // Assert Tab Data      
      await caseDetailsPage.assertTabData(caseFlagTabData);
    }
  );

  test(
    'Consented - Judge manage case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage }) => {
      // Create and setup case
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToCreateFlag();

      // Login as Judge and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage each flag individually as Judge
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'case', 'Complex Case', 'Test case');
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'applicant', 'Vulnerable user', 'Test applicant');
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'respondent', 'Other, Other Flag Type', 'Test respondent', false);

      // Assert Tab Data after all flags are managed
      await caseDetailsPage.assertTabData(caseFlagTabDataUpdated);
    }
  );
});
