import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { expressCaseGateKeepingTabDataJudgeAllocation } from '../../../data/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';

async function createAndProcessFormACase(isExpressPilot: boolean): Promise<string> {
  const caseId = isExpressPilot ? await CaseDataHelper.createContestedFormAWithExpressPilotEnrolled() :
   await CaseDataHelper.createBaseContestedFromA();

   await PayloadHelper.solicitorSubmitFromACase(caseId);
   await PayloadHelper.caseworkerAllocateToJudge(caseId);
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

          await giveAllocationDirectionsPage.verifyFastTrackQuestionAbsence();
          await giveAllocationDirectionsPage.selectComplexCase(YesNoRadioEnum.NO)
          await giveAllocationDirectionsPage.verifyExpressPilotQuestionPresence();
          await giveAllocationDirectionsPage.selectExpressPilotParticipation(YesNoRadioEnum.YES)
          await giveAllocationDirectionsPage.selectJudgeAllocated();
          await giveAllocationDirectionsPage.selectTimeEstimate();
          await giveAllocationDirectionsPage.navigateContinue();
          await giveAllocationDirectionsPage.navigateSubmit();

          await caseDetailsPage.assertTabData(expressCaseGateKeepingTabDataJudgeAllocation);
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
        await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
        await manageCaseDashboardPage.navigateToCase(caseId);
    
        await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
        await allocationDirectionsCourtSelectionPage.navigateContinue();

        await giveAllocationDirectionsPage.verifyFastTrackQuestionPresence();
        await giveAllocationDirectionsPage.verifyExpressPilotQuestionAbsence();
        await giveAllocationDirectionsPage.selectFastTrackParticipation(YesNoRadioEnum.YES)
      }
  );
});

test.describe('Contested - Give Allocation Directions - Static warning on express pilot cases', () => {
  test(
    'Should display a static warning message if it is an express pilot case',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        allocationDirectionsCourtSelectionPage
      }
    ) => {
      const caseId = await createAndProcessFormACase(true); // Pass true for express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
      await allocationDirectionsCourtSelectionPage.verifyExistenceOfExpressPilotWarningMessage();
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
        allocationDirectionsCourtSelectionPage
      },
    ) => {
      const caseId = await createAndProcessFormACase(false); // Pass false for non-express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.judge.email, config.judge.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(contestedEvents.giveAllocationDirection);
      await allocationDirectionsCourtSelectionPage.verifyAbsenceOfExpressPilotWarningMessage();
    }
  );
});
