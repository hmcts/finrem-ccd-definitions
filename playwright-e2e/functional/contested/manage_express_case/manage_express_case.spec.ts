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
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/express_pilot/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

async function createAndProcessPaperCase(type: string): Promise<string> {
  const caseId = await createCaseInCcd(config.caseWorker.email, config.caseWorker.password, `./playwright-e2e/data/payload/contested/paper_case/express_pilot/ccd-contested${type == '' ? '' : ('-' + type)}-express-case-creation.json`, 'FinancialRemedyContested', 'FR_newPaperCase');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

async function processExpressCase(caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, manageExpressCasePage: any) {
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
  // TODO - Go to Gatekeeping and allocation tab to verify "Express Pilot Participation: Withdrawn" exists
}

test.describe('Contested - Manage Express Case', () => {
  test(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
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
      await processExpressCase(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, manageExpressCasePage);
    }
  );

  test(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
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
      const caseId = await createAndProcessPaperCase('');
      await processExpressCase(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, manageExpressCasePage);
    }
  );

  test(
    'Contested - Not qualified cases - Show not qualified message',
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
      const caseId = await createAndProcessPaperCase('not-qualified');
      //await processExpressCase(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, manageExpressCasePage);
    }
  );
});
