import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseWithExpressPilot } from '../../helpers/ExpressPilotHelper';
import { updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { updateCaseWorkerSteps } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

async function createAndProcessFormACase(isExpressPilot: boolean): Promise<string> {
  const caseId = await createCaseWithExpressPilot(
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

test.describe("Contested - Give Allocation Directions - 'should this case remain in the Express Pilot?' on express pilot cases", () => {
    test(
        'Should display EP question if it is an express pilot case.',
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
          const caseId = await createAndProcessFormACase(true); // Pass true for express pilot case
          await manageCaseDashboardPage.visit();
          await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
          await manageCaseDashboardPage.navigateToCase(caseId);
      
          await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
          await allocationDirectionsCourtSelectionPage.navigateContinue();

          // TODO
          await giveAllocationDirectionsPage.verifyFastTrackQuestionAbsence();
          await giveAllocationDirectionsPage.verifyExpressPilotQuestionPresence();
          await giveAllocationDirectionsPage.selectExpressPilotParticipation(true)
        }
    );

    test(
      'Should NOT display EP question if it is NOT an express pilot case.',
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
        await giveAllocationDirectionsPage.verifyExpressPilotQuestionAbsence();
        await giveAllocationDirectionsPage.selectFastTrackParticipation(YesNoRadioEnum.YES)
      }
  );
});
