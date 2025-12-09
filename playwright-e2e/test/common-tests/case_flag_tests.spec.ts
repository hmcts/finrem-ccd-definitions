import { test } from '../../fixtures/fixtures.ts';
import config from '../../config/config.ts';
import { caseFlagTabData } from '../../resources/tab_content/common-tabs/case_flag_tabs.ts';
import { caseFlagTabDataUpdated } from '../../resources/tab_content/common-tabs/case_flag_tabs_updated.ts';
import { createFlag, manageFlagOnce } from '../../pages/helpers/CaseFlagHelper.ts';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { ContestedEvents } from '../../config/case-data.ts';

// Test data for consented cases
const consentedCaseFlagTestData = [
  {
    createTitle: 'Caseworker creates case flag',
    manageTitle: 'Caseworker manages case flag',
    user: config.caseWorker,
    path: config.loginPaths.worklist
  },
  {
    createTitle: 'Judge creates case flag',
    manageTitle: 'Judge manages case flag',
    user: config.judge,
    path: config.loginPaths.cases
  }
];

// Test data for contested cases
const contestedCaseFlagTestData = [
  {
    title: 'Caseworker creates case flag for Form A',
    setupCase: () => {return ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();},
    user: config.caseWorker,
    path: config.loginPaths.worklist
  },
  {
    title: 'Judge creates case flag for Form A',
    setupCase: () => {return ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();},
    user: config.judge,
    path: config.loginPaths.cases
  },
  {
    title: 'Caseworker creates case flag for Paper Case',
    setupCase: () => {return ContestedCaseFactory.createAndSubmitPaperCase();},
    user: config.caseWorker,
    path: config.loginPaths.worklist
  },
  {
    title: 'Caseworker creates case flag for Schedule1 Case',
    setupCase: () => {return ContestedCaseFactory.createAndProcessSchedule1CaseUpToIssueApplication();},
    user: config.caseWorker,
    path: config.loginPaths.worklist
  }
];

test.describe('Case Flag Tests', () => {
  // Consented case flag tests
  for (const data of consentedCaseFlagTestData) {
    test(
      'Consented - ' + data.createTitle,
      { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
        // Create and setup case
        const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();

        // Login and navigate to case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(data.user.email, data.user.password, config.manageCaseBaseURL, data.path);
        await manageCaseDashboardPage.navigateToCase(caseId);

        // Create case flag
        await createFlag(caseDetailsPage, createFlagPage, 'case',
          () => {return createFlagPage.selectComplexCase();},
          'Test case'
        );

        // Create applicant flag
        await createFlag(caseDetailsPage, createFlagPage, 'applicant',
          () => {return createFlagPage.selectVulnerableUser();},
          'Test applicant'
        );

        // Create respondent flag
        await createFlag(caseDetailsPage, createFlagPage, 'respondent',
          () => {return createFlagPage.selectOther('Other Flag Type');},
          'Test respondent'
        );

        // Assert Tab Data
        await caseDetailsPage.assertTabData(caseFlagTabData);
      }
    );

    test(
      'Consented - ' + data.manageTitle,
      { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage }) => {
        // Create and setup case
        const caseId = await ConsentedCaseFactory.createConsentedCaseUpToCreateFlag();

        // Login and navigate to case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(data.user.email, data.user.password, config.manageCaseBaseURL, data.path);
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

  // Contested case flag tests
  for (const data of contestedCaseFlagTestData) {
    test(
      data.title,
      { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
        // Create and setup case
        const caseId = await data.setupCase();

        // Login and navigate to case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(data.user.email, data.user.password, config.manageCaseBaseURL, data.path);
        await manageCaseDashboardPage.navigateToCase(caseId);

        // Create case flag
        await createFlag(caseDetailsPage, createFlagPage, 'case',
          () => {return createFlagPage.selectComplexCase();},
          'Test case'
        );

        // Create applicant flag
        await createFlag(caseDetailsPage, createFlagPage, 'applicant',
          () => {return createFlagPage.selectVulnerableUser();},
          'Test applicant'
        );

        // Create respondent flag
        await createFlag(caseDetailsPage, createFlagPage, 'respondent',
          () => {return createFlagPage.selectOther('Other Flag Type');},
          'Test respondent'
        );

        await caseDetailsPage.assertTabData(caseFlagTabData);
      }
    );
  }

  test(
    'Contested - Caseworker manage case flag And Refund for Form A',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageFlagPage, refundPage, eventSummaryPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToCreateFlag();

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage each flag individually
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'case', 'Complex Case', 'Test case');
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'applicant', 'Vulnerable user', 'Test applicant');
      await manageFlagOnce(caseDetailsPage, manageFlagPage, 'respondent', 'Other, Other Flag Type', 'Test respondent', false);

      // Assert Tab Data after all flags are managed
      await caseDetailsPage.assertTabData(caseFlagTabDataUpdated);

      await caseDetailsPage.selectNextStep(ContestedEvents.refund);
      await refundPage.verifyRefundPageDisplayed();
      await eventSummaryPage.enterEventSummaryAndDescription('Refund for Form A case', 'Refund details for form A case');
      await refundPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.refund.listItem);
    }
  );
});
