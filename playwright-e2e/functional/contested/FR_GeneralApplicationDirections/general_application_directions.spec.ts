import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseDataHelper } from '../../data-utils/contested/ContestedCaseDataHelper';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

async function performGeneralApplicationDirectionsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  generalApplicationDirectionsPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  const hearingType = "Final Hearing (FH)";
  const courtName = "CHESTERFIELD COUNTY COURT";

  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationDirections);
  await generalApplicationDirectionsPage.chooseWhetherAHearingIsRequired(YesNoRadioEnum.YES);

  //Next, continue tests to drive through new hearing creation

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

test.describe('Contested - General Application Directions', () => {
  test(
    'Form A case creating a hearing from general application directions',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseDataHelper.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await performGeneralApplicationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, generalApplicationDirectionsPage, testInfo, makeAxeBuilder);
      // Next:
      // When add hearing complete, then use that page structure to build and test from this point
    }
  );

  test(
    'Paper Case creating a hearing from general application directions',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseDataHelper.createAndSubmitPaperCase();
      await ContestedCaseDataHelper.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await performGeneralApplicationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, generalApplicationDirectionsPage, testInfo, makeAxeBuilder);
      // Next:
      // When add hearing complete, then use that page structure to build and test from this point
    }
  );

  test.skip(
    'Form A case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseDataHelper.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
    }
  );

  test.skip(
    'Paper case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await ContestedCaseDataHelper.createAndSubmitPaperCase();
      await ContestedCaseDataHelper.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
    }
  );
});
