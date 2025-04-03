import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';

async function createAndProcessFormACase(isExpressPilot: boolean = false): Promise<string> {
  const caseId = isExpressPilot ? await CaseDataHelper.createContestedFromAWithExpressPilotEnrolled() :
   await CaseDataHelper.createBaseContestedFromA();

  await PayloadHelper.solicitorSubmitFromACase(caseId);
  await PayloadHelper.caseWorkerIssueApplication(caseId);
  return caseId;
}

async function createAndProcessPaperCase(isExpressPilot: boolean = false): Promise<string> {
  const caseId = isExpressPilot ? await CaseDataHelper.createContestedPaperCaseWithExpressPilotEnrolled() :
   await CaseDataHelper.createBaseContestedPaperCase();

  await PayloadHelper.caseWorkerSubmitPaperCase(caseId);
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
  caseCreationFn: (isExpressPilot?: boolean) => Promise<string>,
  processFn: (caseId: string, manageCaseDashboardPage: any, loginPage: any, caseDetailsPage: any, manageExpressCasePage: any) => Promise<void>,
  isExpressPilot?: boolean
) {
  test(description, { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageExpressCasePage }) => {
    const caseId = await caseCreationFn(isExpressPilot);
    await processFn(caseId, manageCaseDashboardPage, loginPage, caseDetailsPage, manageExpressCasePage);
  });
}

test.describe('Contested - Manage Express Case', () => {
  runTest(
    'Contested - Enrolled case (Form A Case) - Remove case from express pilot',
    createAndProcessFormACase,
    processSuccessfulExpressCase,
    true
  );

  runTest(
    'Contested - Enrolled case (Paper Case) - Remove case from express pilot',
    createAndProcessPaperCase,
    processSuccessfulExpressCase,
    true
  );

  runTest(
    'Contested - Not qualified case (Form A Case) - Show not enrolled message',
    createAndProcessFormACase,
    processExpressCaseShowNotEnrolledMessage,
    false
  );

  runTest(
    'Contested - Not qualified case (Paper Case) - Show not enrolled message',
    createAndProcessPaperCase,
    processExpressCaseShowNotEnrolledMessage,
    false
  );
});
