import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { updateCaseWorkerSteps } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ExpressPilotHelper } from '../../helpers/ExpressPilotHelper';
import { giveAllocationGateKeepingTabData } from '../../../data/tab_content/contested/gatekeeping_and_allocation/gatekeeping_and_allocation_tab';


async function createAndProcessFormACase(isExpressPilot: boolean): Promise<string> {
  const caseId = await  ExpressPilotHelper.createCaseWithExpressPilot(
    config.applicant_solicitor.email,
    config.applicant_solicitor.password,
    './playwright-e2e/data/payload/contested/forma/ccd-contested-base.json',
    'FinancialRemedyContested',
    'FR_solicitorCreate',
    isExpressPilot
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

test(
  'Contested - FromA - Judge Give Allocation Direction',
  { tag: [] },
  async (
  {
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    allocationDirectionsCourtSelectionPage, 
    giveAllocationDirectionsPage
  }
  ) => {
    const caseId = await createAndProcessFormACase(false);
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
    await allocationDirectionsCourtSelectionPage.navigateContinue();

    await giveAllocationDirectionsPage.verifyFastTrackQuestionPresence();
    await giveAllocationDirectionsPage.selectComplexCase(YesNoRadioEnum.NO)
    await giveAllocationDirectionsPage.verifyExpressPilotQuestionAbsence();
    await giveAllocationDirectionsPage.selectFastTrackParticipation(YesNoRadioEnum.YES)
    await giveAllocationDirectionsPage.selectJudgeAllocated();
    await giveAllocationDirectionsPage.selectTimeEstimate();
    await giveAllocationDirectionsPage.navigateContinue();
    await giveAllocationDirectionsPage.navigateSubmit();

    await caseDetailsPage.assertTabData(giveAllocationGateKeepingTabData);
  }
);
