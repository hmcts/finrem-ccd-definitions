import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';
import { consentedEvents } from '../../config/case_events';
import { caseFlagTabData } from '../../data/tab_content/consented/case_flag_tabs';
import { caseFlagTabDataUpdated } from '../../data/tab_content/consented/case_flag_tabs_updated';

test.describe('Consented Case Flag Tests', () => {
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

      // Helper function to create a flag
      async function createFlag(flagType: 'case' | 'applicant' | 'respondent', flagSelection: () => Promise<void>, comments: string) {
        await caseDetailsPage.selectNextStep(consentedEvents.createFlag);
        await createFlagPage.selectFlagType(flagType);
        await createFlagPage.navigateContinue();
        await createFlagPage.navigateContinue();
        await createFlagPage.problemIfCaseFlagNotSelected();
        await flagSelection();
        await createFlagPage.navigateContinue();
        await createFlagPage.addCommentsToThisFlag(comments);
        await createFlagPage.navigateContinue();
        await createFlagPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated(consentedEvents.createFlag.listItem);
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

      // Helper function to manage a flag
      async function manageFlagOnce(
        flagType: 'case' | 'applicant' | 'respondent',
        flagName: string,
        comment: string,
        checkActive: boolean = true // default to true
      ) {
        // Select the Manage Flags event
        await caseDetailsPage.selectNextStep(consentedEvents.manageFlags);

        // Select the flag type and navigate to the next step
        if (flagType === 'case') {
          await manageFlagPage.selectCaseFlag(flagName, comment);
        } else if (flagType === 'applicant') {
          await manageFlagPage.selectPartyFlag('Frodo Baggins', 'Applicant', flagName, comment);
        } else if (flagType === 'respondent') {
          await manageFlagPage.selectPartyFlag('Smeagol Gollum', 'Respondent', flagName, comment);
        }
        await manageFlagPage.navigateContinue();

        // Update the flag comment and make it inactive
        await manageFlagPage.updateFlagComment(flagName, `Updated ${comment}`);
        await manageFlagPage.makeFlagInactive();
        await manageFlagPage.navigateContinue();
        await manageFlagPage.navigateSubmit();

        // Check the success message and if there are active flags on the case
        await caseDetailsPage.checkHasBeenUpdated(consentedEvents.manageFlags.listItem);
        if (checkActive) {
          await caseDetailsPage.checkActiveCaseFlagOnCase();
        } else {
          await caseDetailsPage.checkNoActiveCaseFlagOnCase();
        }
      }

      // Manage each flag individually
      await manageFlagOnce('case', 'Complex Case', 'Test case');
      await manageFlagOnce('applicant', 'Vulnerable user', 'Test applicant');
      await manageFlagOnce('respondent', 'Other, Other Flag Type', 'Test respondent', false);

      // Assert Tab Data after all flags are managed
      await caseDetailsPage.assertTabData(caseFlagTabDataUpdated);
    }
  );
});
