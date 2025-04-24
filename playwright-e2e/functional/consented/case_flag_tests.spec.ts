import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';
import { caseFlagTabData } from '../../data/tab_content/consented/case_flag_tabs';

test.describe('Consented Case Flag Tests', () => {
  test(
    'Consented - Caseworker creates case flag',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        createFlagPage
      },
    ) => {
      const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
      const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');

      // Login in as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Create Flag against case
      await caseDetailsPage.selectNextStep(consentedEvents.CreateFlag);
      await createFlagPage.selectFlagType('case');
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateContinue()
      await createFlagPage.problemIfCaseFlagNotSelected();
      await createFlagPage.selectComplexCase();
      await createFlagPage.navigateContinue();
      await createFlagPage.addCommentsToThisFlag("Test case");
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.CreateFlag.listItem);
      await caseDetailsPage.checkActiveCaseFlagOnCase();

      // Create Flag against applicant
      await caseDetailsPage.selectNextStep(consentedEvents.CreateFlag);
      await createFlagPage.selectFlagType('applicant');
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateContinue();
      await createFlagPage.problemIfCaseFlagNotSelected();
      await createFlagPage.selectVulnerableUser();
      await createFlagPage.navigateContinue();
      await createFlagPage.addCommentsToThisFlag("Test applicant");
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.CreateFlag.listItem);
      await caseDetailsPage.checkActiveCaseFlagOnCase();

      // Create Flag against respondent
      await caseDetailsPage.selectNextStep(consentedEvents.CreateFlag);
      await createFlagPage.selectFlagType('respondent');
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateContinue();
      await createFlagPage.problemIfCaseFlagNotSelected();
      await createFlagPage.selectOther("Other Flag Type");
      await createFlagPage.navigateContinue();
      await createFlagPage.addCommentsToThisFlag("Test respondent");
      await createFlagPage.navigateContinue();
      await createFlagPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.CreateFlag.listItem);
      await caseDetailsPage.checkActiveCaseFlagOnCase();

      // Assert Tab Data      
      await caseDetailsPage.assertTabData(caseFlagTabData);
    })
});

