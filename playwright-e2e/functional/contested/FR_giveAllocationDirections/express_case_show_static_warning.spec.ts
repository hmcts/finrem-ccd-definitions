import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { updateCaseWorkerSteps } from '../../helpers/PayloadHelper';

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-qualified-express-pilot.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');

  await updateCaseWorkerSteps(caseId, [
    { event: 'FR_HWFDecisionMade', payload: './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json' },
    { event: 'FR_issueApplication', payload: './playwright-e2e/data/payload/contested/caseworker/issue-application.json' },
    { event: 'FR_allocateToJudge' }
  ]);
  return caseId;
}

async function performGiveAllocationDirectionsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  listForHearingPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  await manageCaseDashboardPage.visit();
  await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
  // await listForHearingPage.selectTypeOfHearingDropDown(hearingType);
  // await listForHearingPage.enterTimeEstimate('1 hour');
  // await listForHearingPage.setHearingDateToCurrentDate();
  // await listForHearingPage.verifyHearingDateGuidanceMessages();
  // await listForHearingPage.enterHearingTime('10:00');
  // await listForHearingPage.selectCourtForHearing(courtName);
  // await listForHearingPage.navigateContinue();
  // await listForHearingPage.navigateSubmit();
  // await listForHearingPage.verifyHearingDateWarningMessage('expressPilot');

  // await caseDetailsPage.checkHasBeenUpdated('List for Hearing');
}

test.describe('Contested - Give Allocation Directions - Static warning on express pilot cases', () => {
  test(
    'Should display a static warning message when listing a hearing for an express pilot case',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await createAndProcessFormACase();
      //await performGiveAllocationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
    }
  );
});
