import { test } from '../fixtures/fixtures';
import { createCaseInCcd, updateCaseInCcd } from '../../test/helpers/utils';
import config from '../config/config';
import { createCaseTabData } from '../data/tab_content/contested/solicitor_create_case_tabs';
import { createCaseTabDataPreview } from '../data/tab_content/consented/create_case_tabs';

test(
    'Consented Tab Verification',
    { tag: ['@preview'] },
    async (
        { 
          loginPage,
          manageCaseDashboardPage,
          caseDetailsPage
        }
      ) => {
        const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
        const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
        const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');
        // Login as caseworker
        await manageCaseDashboardPage.visit();
        await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
        await manageCaseDashboardPage.navigateToCase(caseId);
        // Assert tab data
        await caseDetailsPage.assertTabData(createCaseTabDataPreview);
        });

test(
    'Contested Tab Verification',
    { tag: ['@preview'] },
    async (
      { 
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      }
    ) => {
      const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
      const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-contested-payment.json');
      const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/contested/ccd-contested-case-creation.json');
      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
      // Assert tab data
      await caseDetailsPage.assertTabData(createCaseTabData);
    });
