import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

async function performListForHearingFlow(
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
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(ContestedEvents.listForHearing);
  await listForHearingPage.selectTypeOfHearingDropDown(hearingType);
  await listForHearingPage.enterTimeEstimate('1 hour');
  await listForHearingPage.setHearingDateToCurrentDate();
  await listForHearingPage.verifyHearingDateGuidanceMessages();
  await listForHearingPage.enterHearingTime('10:00');
  await listForHearingPage.selectCourtForHearing(courtName);
  await listForHearingPage.enterAdditionalInformationAboutHearing();
  await listForHearingPage.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
  await listForHearingPage.uploadOtherDocuments();
  await listForHearingPage.navigateContinue();
  await listForHearingPage.navigateSubmit();
  await listForHearingPage.navigateIgnoreWarningAndGo();
  await caseDetailsPage.checkHasBeenUpdated('List for Hearing');

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

test.describe('Contested - List for Hearing case shows on hearings tab', () => {
  test.skip(
    'Form A case shows on hearings tab',
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
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProgressToListing();
      await performListForHearingFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      // Next:
      // Run test muliple times, so that the correct notices and documents can be checked as appropriate.
      // Run method that converts this old hearing type to new hearing type format
      // Run tab test to confirm that all the correct hearing information shows on the new hearing tab
    }
  );

  test.skip(
    'Paper Case shows on hearings tab',
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
      const caseId = await ContestedCaseFactory.createAndProcessPaperCaseUpToProgressToListing();
      await performListForHearingFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      // Next: 
      // Run test muliple times, so that the correct notices and documents can be checked as appropriate.
      // Run method that converts this old hearing type to new hearing type format
      // Run tab test to confirm that all the correct hearing information shows on the new hearing tab
    }
  );
});
