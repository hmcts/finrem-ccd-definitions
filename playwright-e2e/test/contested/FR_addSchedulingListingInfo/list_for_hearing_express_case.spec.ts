import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import {DateHelper} from "../../../data-utils/DateHelper.ts";
import {AxeUtils} from "../../../fixtures/utils/axe-utils.ts";

async function performListForHearingFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  listForHearingPage: any,
  testInfo: any,
  axeUtils: AxeUtils
): Promise<void> {
  const hearingType = "Final Hearing (FH)";
  const courtName = "CHESTERFIELD COUNTY COURT";

  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(ContestedEvents.listForHearing);
  await listForHearingPage.selectTypeOfHearingDropDown(hearingType);
  await listForHearingPage.enterTimeEstimate('1 hour');
  await listForHearingPage.setHearingDateToCurrentDate();
  await listForHearingPage.verifyHearingDateGuidanceMessages();
  await listForHearingPage.enterHearingTime('10:00');
  await listForHearingPage.selectCourtForHearing(courtName);
  await axeUtils.audit();
  await listForHearingPage.navigateContinue();
  await listForHearingPage.navigateSubmit();
  await listForHearingPage.verifyHearingDateWarningMessage('expressPilot');
  await axeUtils.audit();

  await caseDetailsPage.checkHasBeenUpdated('List for Hearing');
  await axeUtils.finalizeReport(testInfo);

}

test.describe('Contested - List for Hearing express case', () => {
  test(
    'Contested - List for Hearing express case (Form A)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        axeUtils,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProgressToListing(true, DateHelper.getCurrentDate());
      await performListForHearingFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, axeUtils);
    }
  );

  test(
    'Contested - List for Hearing express case (Paper Case)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        axeUtils,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessPaperCaseUpToProgressToListing(true, DateHelper.getCurrentDate());
      await performListForHearingFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, axeUtils);
    }
  );
});
