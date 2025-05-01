import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await CaseDataHelper.createBaseContestedFromA();
  await PayloadHelper.solicitorSubmitFromACase(caseId);
  return caseId;
}

async function createAndProcessPaperCase(): Promise<string> {
  const caseId = await CaseDataHelper.createBaseContestedPaperCase();
  return caseId;
}

async function performListForInterimHearingsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  listForInterimHearings: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {

  // Hearing types
  const MaintenancePendingSuit = "Maintenance Pending Suit (MPS)";
  const MPSDuration = "1 hour";
  const MPSDay = "01"; 
  const MPSMonth = "01"; 
  const MPSYear = "2025";
  const MPSTime = "10:00";
  const MPSCourt = "CHESTERFIELD COUNTY COURT";
  const MSPFile = "MPSfile.pdf";
  const FirstDirectionsAppointment = "First Directions Appointment (FDA)";
  const FinancialDisputeResolution = "Financial Dispute Resolution Hearing (FDR)";
  const FinalHearing = "Final Hearing (FH)";
  const Directions = "Directions (DIR)";

  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.listForInterimHearing);
  await listForInterimHearings.clickAddNew();
  await listForInterimHearings.selectTypeOfHearing(MaintenancePendingSuit);
  await listForInterimHearings.enterTimeEstimate(MPSDuration);
  await listForInterimHearings.enterHearingDate(MPSDay, MPSMonth, MPSYear);
  await listForInterimHearings.enterHearingTime(MPSTime);
  await listForInterimHearings.selectCourtForHearing(MPSCourt);
  await listForInterimHearings.enterAdditionalInformationAboutHearing();
  await listForInterimHearings.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
  await listForInterimHearings.uploadOtherDocuments(MSPFile);

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

test.describe('Contested - List for Interim Hearing', () => {
  test(
    'Contested - List for Interim Hearing (Form A)',
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
      const caseId = await createAndProcessFormACase();
      await performListForInterimHearingsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForInterimHearingPage, testInfo, makeAxeBuilder)
    }
  );

  test(
    'Contested - List for Interim Hearing (Paper Case)',
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
      const caseId = await createAndProcessPaperCase();
      await performListForInterimHearingsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, listForInterimHearingPage, testInfo, makeAxeBuilder);
    }
  );
});
