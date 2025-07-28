import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { migratedListForHearingsTabDataOnHearing1 } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { migratedListForHearingsTabDataOnHearing2 } from '../../../resources/tab_content/contested/hearings_tabs.ts';

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performListForHearingFlow(
  caseDetailsPage: any,
  listForHearingPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  const hearingType = "Final Hearing (FH)";
  const courtName = "CHESTERFIELD COUNTY COURT";

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

async function performManageHearings(
    caseDetailsPage: any,
    manageHearingPage: any
): Promise<void> {

    await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
    await manageHearingPage.assertWhatWouldYouLikeToDoRequired();

    await manageHearingPage.selectAddANewHearing();
    await manageHearingPage.navigateContinue();
    await manageHearingPage.addHearing({
        type: "Pre-Trial Review (PTR)",
        duration: '2 hours',
        date: { day: "03", month: "03", year: "2024" },
        time: '10:00 AM',
        court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
        attendance: 'Remote - video call',
        additionalInformation: 'Hearing details here',
        uploadAnySupportingDocuments: false,
        sendANoticeOfHearing: true
    });

    await manageHearingPage.navigateContinue();
    await manageHearingPage.navigateIgnoreWarningAndContinue();
    await manageHearingPage.navigateSubmit();
}

test.describe('Contested - List for Hearing case shows on hearings tab after migration', () => {
  // non-prod only
  test.skip(
    'Form A case - List for hearing information shows on new hearings tab.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        blankPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProgressToListing();
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing1);
    }
  );

  // non-prod only
  test.skip(
    'Form A case - List for hearing information shows on new hearings tab after any manage hearings event.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        manageHearingPage,
        blankPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProgressToListing();
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performManageHearings(caseDetailsPage, manageHearingPage);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing2);
    }
  );

  // non-prod only
  test.skip(
    'Paper Case - List for hearing information shows on new hearings tab.',
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
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing1);
    }
  );

  // non-prod only
  test.skip(
    'Paper Case - List for hearing information shows on new hearings tab after any manage hearings event.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        manageHearingPage,
        blankPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessPaperCaseUpToProgressToListing();
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performManageHearings(caseDetailsPage, manageHearingPage);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing2);
    }
  );
});
