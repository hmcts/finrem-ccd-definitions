import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { migratedListForHearingsTabDataOnHearing1 } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { migratedListForHearingsTabDataOnHearing2 } from '../../../resources/tab_content/contested/hearings_tabs.ts';

async function loginAsCaseWorker(manageCaseDashboardPage: any, loginPage: any, caseId: string): Promise<void> {
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
  listForHearingPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await listForHearingPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('Manage Hearings Migration');

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
        date: {},
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
      await loginAsCaseWorker(manageCaseDashboardPage, loginPage, caseId);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
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
      await loginAsCaseWorker(manageCaseDashboardPage, loginPage, caseId);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      // Next: 
      // Run test muliple times, so that the correct notices and documents can be checked as appropriate.
      // Run method that converts this old hearing type to new hearing type format
      // Run tab test to confirm that all the correct hearing information shows on the new hearing tab
    }
  );
});

test.describe('Contested - List for Hearing Migration', () => {
  test(
    'Form A case shows on hearings tab after manage hearings event',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForHearingPage,
        manageHearingPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProgressToListing();

      await loginAsCaseWorker(manageCaseDashboardPage, loginPage, caseId);
      await performManageHearings(caseDetailsPage, manageHearingPage);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);

      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing2);
    }
  );
  test(
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

      await loginAsCaseWorker(manageCaseDashboardPage, loginPage, caseId);
      await performListForHearingFlow(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);
      await performManageHearingsMigration(caseDetailsPage, listForHearingPage, testInfo, makeAxeBuilder);

      await caseDetailsPage.assertTabData(migratedListForHearingsTabDataOnHearing1);
    }
  );
});
