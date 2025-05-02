import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CaseDataHelper } from '../helpers/CaseDataHelper';
import { PayloadHelper } from '../helpers/PayloadHelper';
import { consentedEvents } from '../../config/case_events';
import { caseFlagTabData } from '../../data/tab_content/consented/case_flag_tabs';

test.describe('Consented Case Flag Tests', () => {
  test(
    'Consented - Caseworker creates case flag',
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, createFlagPage }) => {
      // Create and setup case
      const caseId = await CaseDataHelper.createBaseContestedFormA();
      await PayloadHelper.solicitorSubmitFormACase(caseId);
      await PayloadHelper.caseWorkerIssueApplication(caseId);

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Helper function to create a flag
      async function createFlag(flagType: 'case' | 'applicant' | 'respondent', flagSelection: () => Promise<void>, comments: string) {
        await caseDetailsPage.selectNextStep(consentedEvents.CreateFlag);
        await createFlagPage.selectFlagType(flagType);
        await createFlagPage.navigateContinue();
        await createFlagPage.navigateContinue();
        await createFlagPage.problemIfCaseFlagNotSelected();
        await flagSelection();
        await createFlagPage.navigateContinue();
        await createFlagPage.addCommentsToThisFlag(comments);
        await createFlagPage.navigateContinue();
        await createFlagPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated(consentedEvents.CreateFlag.listItem);
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
      const caseId = await CaseDataHelper.createBaseContestedFormA();
      await PayloadHelper.solicitorSubmitFormACase(caseId);
      await PayloadHelper.caseworkerCreateFlag(caseId);

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Helper function to manage a flag
      async function manageFlag(flagType: 'case' | 'applicant' | 'respondent', flagSelection: () => Promise<void>, comments: string) {
        await caseDetailsPage.selectNextStep(consentedEvents.ManageFlag);
        await manageFlagPage.selectFlagType(flagType);
        await manageFlagPage.navigateContinue();
        
      }

      
    }
  );
});
