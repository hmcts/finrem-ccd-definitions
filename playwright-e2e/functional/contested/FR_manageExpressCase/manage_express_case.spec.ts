import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';

interface ReplacementAction {
  action: 'delete' | 'insert';
  key: string;
  value?: string;
}

const NOT_QUALIFIED_REPLACEMENT: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'insert', key: 'regionList', value: 'midlands' },
  { action: 'delete', key: 'northWestFRCList' },
  { action: 'insert', key: 'midlandsFRCList', value: 'birmingham' },
  { action: 'delete', key: 'lancashireCourtList' },
  { action: 'insert', key: 'birminghamCourtList', value: 'FR_birmingham_hc_list_2' }
];

async function updateCaseWorkerSteps(caseId: string, steps: { event: string, payload: string }[]) {
  for (const step of steps) {
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', step.event, step.payload);
  }
}

async function createAndProcessFormACase(type: string | null = null): Promise<string> {
  let replacement: ReplacementAction[] = [];
  if (type === 'not-qualified') {
    replacement = NOT_QUALIFIED_REPLACEMENT;
  }
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-qualified-express-pilot.json', 'FinancialRemedyContested', 'FR_solicitorCreate', replacement);
  await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

async function createAndProcessPaperCase(type: string | null = null): Promise<string> {
  let replacement: ReplacementAction[] = [];
  if (type === 'not-qualified') {
    replacement = NOT_QUALIFIED_REPLACEMENT;
  }
  const caseId = await createCaseInCcd(config.caseWorker.email, config.caseWorker.password, `./playwright-e2e/data/payload/contested/paper_case/ccd-contested-qualified-express-pilot.json`, 'FinancialRemedyContested', 'FR_newPaperCase', replacement);

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_manualPayment', payload: './playwright-e2e/data/payload/contested/caseworker/manual-payment.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' }
  ]);
  return caseId;
}

async function navigateToCaseAndAssertTabData(caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, tabName: string, tabContent: string[]) {
  await manageCaseDashboardPage.visit();
  await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
  await manageCaseDashboardPage.navigateToCase(caseId);
  await caseDetailsPage.assertTabData([{ tabName, tabContent }]);
}

async function manageExpressCaseSteps(caseDetailsPage: any, manageExpressCasePage: any, tabName: string, tabContent: string[]) {
  await caseDetailsPage.selectNextStep(contestedEvents.manageExpressCase);
  await manageExpressCasePage.selectExpressPilotQuestionNo();
  await manageExpressCasePage.uncheckConfirmRemoveCaseFromExpressPilot();
  await manageExpressCasePage.navigateSubmit();
  await manageExpressCasePage.verifyFieldIsRequiredMessageShown();
  await manageExpressCasePage.checkConfirmRemoveCaseFromExpressPilot();
  await manageExpressCasePage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('Manage Express Case');
  await caseDetailsPage.assertTabData([{ tabName, tabContent }]);
}

async function processSuccessfulExpressCase(caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, manageExpressCasePage: any) {
  await navigateToCaseAndAssertTabData(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, 'Gatekeeping and allocation', ['Express Pilot Participation: Enrolled']);
  await manageExpressCaseSteps(caseDetailsPage, manageExpressCasePage, 'Gatekeeping and allocation', ['Express Pilot Participation: Withdrawn']);
  await caseDetailsPage.selectNextStep(contestedEvents.manageExpressCase);
  await manageExpressCasePage.verifyExpressPilotWasWithdrawn();
  await manageExpressCasePage.navigateSubmit();
  await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Withdrawn'] }]);
}

async function processExpressCaseShowNotEnrolledMessage(caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, manageExpressCasePage: any) {
  await navigateToCaseAndAssertTabData(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, 'Gatekeeping and allocation', ['Express Pilot Participation: Does not qualify']);
  await caseDetailsPage.selectNextStep(contestedEvents.manageExpressCase);
  await manageExpressCasePage.verifyExpressPilotNotEnrolled();
  await manageExpressCasePage.navigateSubmit();
  await caseDetailsPage.assertTabData([{ tabName: 'Gatekeeping and allocation', tabContent: ['Express Pilot Participation: Does not qualify'] }]);
}

function runTest(
  description: string,
  caseCreationFn: (type?: string) => Promise<string>,
  processFn: (caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, manageExpressCasePage: any) => Promise<void>,
  type?: string
) {
  test(description, { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
    const caseId = await caseCreationFn(type);
    await processFn(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, manageExpressCasePage);
  });
}

test.describe('Contested - Manage Express Case', () => {
  runTest(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
    createAndProcessFormACase,
    processSuccessfulExpressCase
  );

  runTest(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
    createAndProcessPaperCase,
    processSuccessfulExpressCase
  );

  runTest(
    'Contested - Not qualified case (Form A Case) - Show not enrolled message',
    createAndProcessFormACase,
    processExpressCaseShowNotEnrolledMessage,
    'not-qualified'
  );

  runTest(
    'Contested - Not qualified case (Paper Case) - Show not enrolled message',
    createAndProcessPaperCase,
    processExpressCaseShowNotEnrolledMessage,
    'not-qualified'
  );
});
