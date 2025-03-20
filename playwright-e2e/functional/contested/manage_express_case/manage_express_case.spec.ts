import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';

async function updateCaseWorkerSteps(caseId: string, steps: { event: string, payload: string }[]) {
  for (const step of steps) {
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', step.event, step.payload);
  }
}

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

async function createAndProcessPaperCase(): Promise<string> {
  const caseId = await createCaseInCcd(config.caseWorker.email, config.caseWorker.password, './playwright-e2e/data/payload/contested/paper_case/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_newPaperCase');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

test.describe('Contested - Manage Express Case', () => {
  test(
    'Contested - Enrolled express case (Form A Case) - Manage Express Case flow',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        manageExpressCasePage,
      },
      testInfo
    ) => {
      const caseId = await createAndProcessFormACase();
      
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.manageExpressCase);
      await manageExpressCasePage.selectExpressPilotQuestionNo();
      await manageExpressCasePage.uncheckConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await manageExpressCasePage.verifyFieldIsRequiredMessageShown();
      await manageExpressCasePage.checkConfirmRemoveCaseFromExpressPilot();
      await manageExpressCasePage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
    }
  );

  // test(
  //   'Contested - List for Hearing express case (Paper Case)',
  //   { tag: [] },
  //   async (
  //     {
  //       loginPage,
  //       manageCaseDashboardPage,
  //       caseDetailsPage,
  //       listForHearingPage,
  //       makeAxeBuilder,
  //     },
  //     testInfo
  //   ) => {
  //     const caseId = await createAndProcessPaperCase();
  //     await performManageExpressCaseFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
  //   }
  // );
});
