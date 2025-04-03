import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { giveAllocationGateKeepingTabData } from '../../../data/tab_content/contested/gatekeeping_and_allocation/gatekeeping_and_allocation_tab';

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
    const caseId = await CaseDataHelper.createBaseContestedFromA();
    await PayloadHelper.solicitorSubmitFromACase(caseId);
    await PayloadHelper.caseworkerAllocateToJudge(caseId);

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
