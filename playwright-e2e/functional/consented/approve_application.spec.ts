import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
// NOTE: When we remove codecept tests, bring utils and test data into the playwright directory
import * as utils from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';

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
      const caseId = await utils.createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await utils.updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
      const hwfPaymentAccepted = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './test/data/ccd-consented-basic-data.json');
      const issueApplication = await utils.updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_issueApplication', './test/data/ccd-consented-case-worker-issue-data.json');
  
      // Login in as judge
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password);
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
      const tabData = {
        tabName: 'Approved Order',
        tabContent: [
          'Approved Order Letter',
          'ApprovedConsentOrderLetter.pdf',
          'Consent Order / Variation Order Annexed and Stamped',
          'Pension Documents Stamped',
          'Pension Documents Stamped 1',
          'Type of document',
          'Form P1'
        ],
      };
      
      await caseDetailsPage.assertTabData(tabData);
    }
);
