import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { giveAllocationGateKeepingTabData } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/gatekeeping_and_allocation_tab';

test(
  'Contested - FormA - Judge Give Allocation Direction',
  { tag: [] },
  async (
  {
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    allocationDirectionsCourtSelectionPage, 
    giveAllocationDirectionsPage,
    allocateToJudgePage,
    axeUtils
  }, testInfo
  ) => {
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    await caseDetailsPage.selectNextStep(ContestedEvents.allocateToJudge);
    await allocateToJudgePage.verifyAllocateToJudgeHeader();
    await allocateToJudgePage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.allocateToJudge.listItem);

    await manageCaseDashboardPage.signOut();
    await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);

    await caseDetailsPage.selectNextStep(ContestedEvents.giveAllocationDirection);
    await allocationDirectionsCourtSelectionPage.navigateContinue();

    await giveAllocationDirectionsPage.verifyFastTrackQuestionPresence();
    await giveAllocationDirectionsPage.selectComplexCase(YesNoRadioEnum.NO)
    await giveAllocationDirectionsPage.verifyExpressPilotQuestionAbsence();
    await giveAllocationDirectionsPage.selectFastTrackParticipation(YesNoRadioEnum.YES)
    await giveAllocationDirectionsPage.selectJudgeAllocated();
    await giveAllocationDirectionsPage.selectTimeEstimate();
    await axeUtils.audit();
    await giveAllocationDirectionsPage.navigateContinue();
    await giveAllocationDirectionsPage.navigateSubmit();

    await caseDetailsPage.assertTabData(giveAllocationGateKeepingTabData);
    await axeUtils.finalizeReport(testInfo);
  }
);
