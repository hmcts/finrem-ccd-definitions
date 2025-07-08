import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { migratedGeneralApplicationDirectionsTabDataOnHearing1 } from '../../../resources/tab_content/contested/hearings_tabs.ts';

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performGeneralApplicationDirectionsFlow(
  caseDetailsPage: any,
  generalApplicationDirectionsPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationDirections);
  await generalApplicationDirectionsPage.chooseWhetherAHearingIsRequired(YesNoRadioEnum.YES);
  await generalApplicationDirectionsPage.enterHearingDate('01', '01', '2025');
  await generalApplicationDirectionsPage.enterHearingTime('10:00');
  await generalApplicationDirectionsPage.enterTimeEstimate('3 hours');
  await generalApplicationDirectionsPage.selectCourtForHearing();
  await generalApplicationDirectionsPage.enterAdditionalInformationAboutHearing();
  await generalApplicationDirectionsPage.navigateContinue();
  await generalApplicationDirectionsPage.navigateSubmit();

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

async function performManageHearingsMigration(
  caseDetailsPage: any,
  blankPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await blankPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('(Migration) Manage Hearings');

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
    'Form A case - creating a hearing from general application directions shows on hearings tab.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsPage,
        blankPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedGeneralApplicationDirectionsTabDataOnHearing1);
    }
  );

  test(
    'Paper Case - creating a hearing from general application directions shows on hearings tab.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsPage,
        blankPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedGeneralApplicationDirectionsTabDataOnHearing1);
    }
  );

  test.skip(
    'Form A case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseFactory.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
    }
  );

  test.skip(
    'Paper case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await ContestedCaseFactory.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
    }
  );
});
