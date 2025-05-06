import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await CaseDataHelper.createBaseContestedFormA();
  await PayloadHelper.solicitorSubmitFormACase(caseId);
  await PayloadHelper.caseWorkerIssueApplication(caseId)
  await PayloadHelper.caseWorkerProgressToGeneralApplicationOutcome(caseId);
  return caseId;
}

async function createAndProcessPaperCase(): Promise<string> {
  const caseId = await CaseDataHelper.createBaseContestedPaperCase();
  await PayloadHelper.caseWorkerSubmitPaperCase(caseId);
  await PayloadHelper.caseWorkerProgressToGeneralApplicationOutcome(caseId);
  return caseId;
}

async function performGeneralApplicationDirectionsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  listForHearingPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  const hearingType = "Final Hearing (FH)";
  const courtName = "CHESTERFIELD COUNTY COURT";

  await manageCaseDashboardPage.visit();
  // General applications can be created as Caseworker or Solicitor.  Caseworker has 1 extra option to say 'Application received from "Case"'.
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.generalApplicationDirections);
  // await listForHearingPage.selectTypeOfHearingDropDown(hearingType);
  // await listForHearingPage.enterTimeEstimate('1 hour');
  // await listForHearingPage.setHearingDateToCurrentDate();
  // await listForHearingPage.verifyHearingDateGuidanceMessages();
  // await listForHearingPage.enterHearingTime('10:00');
  // await listForHearingPage.selectCourtForHearing(courtName);
  // await listForHearingPage.enterAdditionalInformationAboutHearing();
  // await listForHearingPage.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
  // await listForHearingPage.uploadOtherDocuments();
  // await listForHearingPage.navigateContinue();
  // await listForHearingPage.navigateSubmit();
  // await listForHearingPage.navigateIgnoreWarningAndGo();
  // await caseDetailsPage.checkHasBeenUpdated('List for Hearing');

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

test.describe('Contested - Create General application', () => {
  test(
    'Form A case creating general application',
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
      await performGeneralApplicationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      // Next:
      // Run test muliple times, so that the correct notices and documents can be checked as appropriate.
      // Run method that converts this old hearing type to new hearing type format
      // Run tab test to confirm that all the correct hearing information shows on the new hearing tab
    }
  );

  test(
    'Paper Case creating general application',
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
      const caseId = await createAndProcessPaperCase();
      // await performGeneralApplicationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      // Next: 
      // Run test muliple times, so that the correct notices and documents can be checked as appropriate.
      // Run method that converts this old hearing type to new hearing type format
      // Run tab test to confirm that all the correct hearing information shows on the new hearing tab
    }
  );
});
