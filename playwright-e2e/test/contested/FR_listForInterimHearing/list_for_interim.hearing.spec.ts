import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedCaseFactory } from '../../../data-utils/contested/ContestedCaseFactory';

// Hearing types
const MaintenancePendingSuit = {
  type: "Maintenance Pending Suit (MPS)",
  duration: "1 hour",
  date: { day: "01", month: "01", year: "2026" },
  time: "10:00",
  information: "MPS: Additional information about the hearing",
  court: "CHESTERFIELD COUNTY COURT",
  file: "MPSfile.pdf"
};

const FirstDirectionsAppointment = {
  type: "First Directions Appointment (FDA)",
  duration: "2 hour",
  date: { day: "02", month: "02", year: "2026" },
  time: "11:00",
  information: "FDA: Additional information about the hearing",
  court: "DERBY COMBINED COURT CENTRE",
  file: "FDAfile.pdf"
};

const FinancialDisputeResolution = {
  type: "Financial Dispute Resolution (FDR)",
  duration: "3 hours",
  date: { day: "03", month: "03", year: "2026" },
  time: "12:00",
  information: "FDR: Additional information about the hearing",
  court: "NOTTINGHAM COUNTY COURT AND FAMILY COURT",
  file: "FDRfile.pdf"
};

const FinalHearing = {
  type: "Final Hearing (FH)",
  duration: "4 hours",
  date: { day: "04", month: "04", year: "2026" },
  time: "13:00",
  information: "FH: Additional information about the hearing",
  court: "LEICESTER COUNTY COURT AND FAMILY COURT",
  file: "FHfile.pdf"
};

const Directions = {
  type: "Directions (DIR)",
  duration: "30 minutes",
  date: { day: "05", month: "05", year: "2026" },
  time: "14:00",
  information: "DIR: Additional information about the hearing",
  court: "BOSTON COUNTY COURT AND FAMILY COURT",
  file: "DIRfile.pdf"
};

const NoFile = {
  type: "Directions (DIR)",
  duration: "40 minutes",
  date: { day: "06", month: "06", year: "2026" },
  time: "15:00",
  information: "No File: Additional information about the hearing",
  court: "LINCOLN COUNTY COURT AND FAMILY COURT",
  file: undefined
};

async function performListForInterimHearingsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  listForInterimHearings: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {

  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);
  await caseDetailsPage.selectNextStep(ContestedEvents.listForInterimHearing);
  // Add 6 distinct interim hearings.  Only the last has no file selected.
  await addHearingDetails(0, MaintenancePendingSuit, listForInterimHearings);
  await addHearingDetails(1, FirstDirectionsAppointment, listForInterimHearings);
  await addHearingDetails(2, FinancialDisputeResolution, listForInterimHearings);
  await addHearingDetails(3, FinalHearing, listForInterimHearings);
  await addHearingDetails(4, Directions, listForInterimHearings);
  await addHearingDetails(5, NoFile, listForInterimHearings);
  // Confirm and submit once interim hearings added.
  await listForInterimHearings.navigateContinue();
  await listForInterimHearings.navigateSubmit();

  // Next:
  // Run method that converts this old hearing type to new hearing type format
  // Run tab test to confirm that all the correct hearing information shows on the new hearing tab

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

async function addHearingDetails(
  hearing_position: number,
  hearingDetails: {
    type: string;
    duration: string;
    date: { day: string; month: string; year: string };
    time: string;
    information: string;
    court: string;
    file: string | undefined;
  },
  listForInterimHearings: any
): Promise<void> {
  await listForInterimHearings.navigateAddNew();
  await listForInterimHearings.selectTypeOfHearing(hearing_position, hearingDetails.type);
  await listForInterimHearings.enterTimeEstimate(hearing_position, hearingDetails.duration);
  await listForInterimHearings.enterHearingDate(hearing_position, hearingDetails.date.day, hearingDetails.date.month, hearingDetails.date.year);
  await listForInterimHearings.enterHearingTime(hearing_position, hearingDetails.time);
  await listForInterimHearings.selectCourtForHearing(hearing_position, hearingDetails.court);
  await listForInterimHearings.enterAdditionalInformationAboutHearing(hearing_position, hearingDetails.information);
  if (hearingDetails.file) {
    await listForInterimHearings.whetherToUploadOtherDocuments(hearing_position, YesNoRadioEnum.YES);
    await listForInterimHearings.uploadOtherDocuments(hearing_position, hearingDetails.file);
  } else {
    await listForInterimHearings.whetherToUploadOtherDocuments(hearing_position, YesNoRadioEnum.NO);
  }
}

test.describe('Contested - List for Interim Hearings', () => {
  test(
    'Contested - List for Interim Hearings (Form A)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForInterimHearingPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACase();
      await performListForInterimHearingsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForInterimHearingPage, testInfo, makeAxeBuilder)
    }
  );

  test(
    'Contested - List for Interim Hearings (Paper Case)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        listForInterimHearingPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createBaseContestedPaperCase();
      await performListForInterimHearingsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForInterimHearingPage, testInfo, makeAxeBuilder);
    }
  );
});
