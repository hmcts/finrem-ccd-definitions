import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';
import { approvedOrderTabData } from '../../data/tab_content/consented/approve_application_tabs';

test(
    'Consented - Approve Application',
    { tag: [] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        approveApplicationPage,
      },
    ) => {
      const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
      const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');
      const issueApplication = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
  
      // Login in as judge
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Approve Application 
      await caseDetailsPage.selectNextStep(consentedEvents.ApproveApplication); 
      await approveApplicationPage.selectIsSubjectTo(true)
      await approveApplicationPage.selectIsPensionProvider(false);
      await approveApplicationPage.selectJudge('District Judge')
      await approveApplicationPage.navigateContinue();
      await approveApplicationPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.ApproveApplication.listItem);

      // Assert Tab Data      
      await caseDetailsPage.assertTabData(approvedOrderTabData);
    }
);
