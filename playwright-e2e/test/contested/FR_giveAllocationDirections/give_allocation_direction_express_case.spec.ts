import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { expressCaseGateKeepingTabDataJudgeAllocation } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';

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
          const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToAllocateJudge(true); // Pass true for express pilot case
          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
          await manageCaseDashboardPage.navigateToCase(caseId);
      
          await caseDetailsPage.selectNextStep(ContestedEvents.giveAllocationDirection);
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
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToAllocateJudge(false); // Pass false or leave blank for non-express pilot case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
        await manageCaseDashboardPage.navigateToCase(caseId);
    
        await caseDetailsPage.selectNextStep(ContestedEvents.giveAllocationDirection);
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
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToAllocateJudge(true); // Pass true for express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(ContestedEvents.giveAllocationDirection);
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
        allocationDirectionsCourtSelectionPage,
        axeUtils
      },testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToAllocateJudge(false); // Pass false or leave blank for non-express pilot case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);
    
      await caseDetailsPage.selectNextStep(ContestedEvents.giveAllocationDirection);
      await axeUtils.audit();
      await allocationDirectionsCourtSelectionPage.verifyAbsenceOfExpressPilotWarningMessage();
      await axeUtils.finalizeReport(testInfo);
    }
  );
});
