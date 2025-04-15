import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';
import { approvedOrderTabData } from '../../data/tab_content/consented/approve_application_tabs';

test(
  'Consented - Caseworker creates case flag',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
    },
  ) => {
    const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');

    // Login in as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Create Flag



    // Assert Tab Data      
    await caseDetailsPage.assertTabData(approvedOrderTabData);
  }
);
