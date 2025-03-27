import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { ReplacementAction } from '../../../types/replacement-action';
import { updateCaseWorkerSteps } from '../../helpers/PayloadHelper';

const NOT_QUALIFIED_REPLACEMENT: ReplacementAction[] = [
  { action: 'delete', key: 'regionList' },
  { action: 'insert', key: 'regionList', value: 'midlands' },
  { action: 'delete', key: 'northWestFRCList' },
  { action: 'insert', key: 'midlandsFRCList', value: 'birmingham' },
  { action: 'delete', key: 'lancashireCourtList' },
  { action: 'insert', key: 'birminghamCourtList', value: 'FR_birmingham_hc_list_2' }
];

async function createAndProcessFormACase(isExpressPilot: boolean): Promise<string> {
  let replacement: ReplacementAction[] = [];
  if (!isExpressPilot) {
    replacement = NOT_QUALIFIED_REPLACEMENT;
  }
  const caseId = await createCaseInCcd(
    config.applicant_solicitor.email,
    config.applicant_solicitor.password,
    './playwright-e2e/data/payload/contested/forma/ccd-contested-qualified-express-pilot.json',
    'FinancialRemedyContested',
    'FR_solicitorCreate',
    replacement
  );
  await updateCaseInCcd(
    config.applicant_solicitor.email,
    config.applicant_solicitor.password,
    caseId,
    'FinancialRemedyContested',
    'FR_applicationPaymentSubmission',
    './playwright-e2e/data/payload/contested/solicitor/case-submission.json'
  );

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' },
    { event: 'FR_allocateToJudge' }
  ]);
  return caseId;
}

test.describe('Contested - Give Allocation Directions - Static warning on express pilot cases', () => {
  test(
    'Should display a static warning message if it is an express pilot case',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        giveAllocationDirectionsPage
      },
      testInfo
    ) => {
      const caseId = await createAndProcessFormACase(true); // Pass true for express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
      await giveAllocationDirectionsPage.verifyExistenceOfExpressPilotWarningMessage();
    }
  );
  test(
    'Should NOT display a warning message if it is not an express pilot case.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        giveAllocationDirectionsPage
      },
      testInfo
    ) => {
      const caseId = await createAndProcessFormACase(false); // Pass false for non-express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
      await giveAllocationDirectionsPage.verifyAbsenseOfExpressPilotWarningMessage();
    }
  );
});
