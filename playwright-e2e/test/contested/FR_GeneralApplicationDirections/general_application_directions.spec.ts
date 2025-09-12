import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { migratedGeneralApplicationDirectionsTabDataOnHearing1 } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { AxeUtils } from "../../../fixtures/utils/axe-utils.ts";
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi.ts';
import { contestedGeneralApplicationDirectionsMHTableData } from '../../../resources/check_your_answer_content/general_applcations_directions/generalApplicationDirectionsMHTabl.ts';

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performGeneralApplicationDirectionsFlow(
  caseDetailsPage: any,
  generalApplicationDirectionsPage: any,
  testInfo: any,
  axeUtils: AxeUtils
): Promise<void> {
  await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationDirections);
  await generalApplicationDirectionsPage.chooseWhetherAHearingIsRequired(YesNoRadioEnum.YES);
  await generalApplicationDirectionsPage.enterHearingDate('01', '01', '2025');
  await generalApplicationDirectionsPage.enterHearingTime('10:00');
  await generalApplicationDirectionsPage.enterTimeEstimate('3 hours');
  await generalApplicationDirectionsPage.selectCourtForHearing();
  await generalApplicationDirectionsPage.enterAdditionalInformationAboutHearing();
  await axeUtils.audit({
    exclude:[
      '#generalApplicationDirectionsHearingTime',
      '#generalApplicationDirectionsHearingTimeEstimate',
      '#generalApplicationDirectionsAdditionalInformation'
    ]
  });
  await generalApplicationDirectionsPage.navigateContinue();
  await generalApplicationDirectionsPage.navigateSubmit();

}

async function performNewGeneralApplicationDirectionsFlowWithHearing(
  caseDetailsPage: any,
  generalApplicationDirectionsMHPage: any,
  checkYourAnswersPage: any,
  testInfo: any,
  axeUtils: AxeUtils
): Promise<void> {
  await caseDetailsPage.selectNextStep(ContestedEvents.generalAppDirectionsMH);
  await generalApplicationDirectionsMHPage.chooseWhetherAHearingIsRequired(YesNoRadioEnum.YES);
  await generalApplicationDirectionsMHPage.selectTypeOfHearing('Application Hearing');
  await generalApplicationDirectionsMHPage.enterTimeEstimate('3 hours');
  await generalApplicationDirectionsMHPage.enterHearingDate('01', '01', '2025');
  await generalApplicationDirectionsMHPage.enterHearingTime('10:00');
  await generalApplicationDirectionsMHPage.selectCourtForHearing();
  await generalApplicationDirectionsMHPage.selectHearingAttendees('Remote - video call');
  await generalApplicationDirectionsMHPage.enterAdditionalInformationAboutHearing('This is a test hearing');
  await generalApplicationDirectionsMHPage.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
  await generalApplicationDirectionsMHPage.uploadOtherDocuments('test.doc');
  await generalApplicationDirectionsMHPage.selectSendNoticeOfHearing(YesNoRadioEnum.NO);
  await generalApplicationDirectionsMHPage.navigateContinue();
  await generalApplicationDirectionsMHPage.verifyErrorMessageForNoNotice();
  await generalApplicationDirectionsMHPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
  await generalApplicationDirectionsMHPage.unSelectWhoShouldSeeThisOrder('Applicant', 'Frodo Baggins');
  await generalApplicationDirectionsMHPage.unSelectWhoShouldSeeThisOrder('Respondent', 'Smeagol Gollum');
  await generalApplicationDirectionsMHPage.selectWhoShouldSeeThisOrder('Intervener1', 'IntApp1');
  await generalApplicationDirectionsMHPage.navigateContinue();
  await generalApplicationDirectionsMHPage.verifyApplicantAndRespondentNotSelectedToReceiveNoticeError();
  
  await generalApplicationDirectionsMHPage.selectAllWhoShouldSeeThisOrder([
    { partyType: 'Applicant', partyName: 'Frodo Baggins' },
    { partyType: 'Respondent', partyName: 'Smeagol Gollum' },
    { partyType: 'Intervener1', partyName: 'IntApp1' },
    { partyType: 'Intervener2', partyName: 'IntResp1' }
  ]);
  await axeUtils.audit({
    exclude: [
      '#workingHearing_additionalHearingDocs_value'
    ]
  });
  await generalApplicationDirectionsMHPage.navigateContinue();
  await checkYourAnswersPage.assertCheckYourAnswersPage(contestedGeneralApplicationDirectionsMHTableData);
  await generalApplicationDirectionsMHPage.navigateSubmit();

}

async function performManageHearingsMigration(
  caseDetailsPage: any,
  blankPage: any,
  testInfo: any,
  axeUtils: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await axeUtils.audit();
  await blankPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('(Migration) Manage Hearings');

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
        axeUtils,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, axeUtils);
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
        axeUtils,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, axeUtils);
      // Next:
      // When add hearing complete, then use that page structure to build and test from this point
    }
  );

  // non-prod only
  test(
    'Form A case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      generalApplicationDirectionsPage,
      blankPage,
      axeUtils,
    },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, axeUtils);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, axeUtils);
      await caseDetailsPage.assertTabData(migratedGeneralApplicationDirectionsTabDataOnHearing1);
    }
  );

  // non-prod only
  test(
    'Paper case shows old-style General Application Direction hearings on the new hearing tab',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      generalApplicationDirectionsPage,
      blankPage,
      axeUtils,
    },
      testInfo) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performGeneralApplicationDirectionsFlow(caseDetailsPage, generalApplicationDirectionsPage, testInfo, axeUtils);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, axeUtils);
      await caseDetailsPage.assertTabData(migratedGeneralApplicationDirectionsTabDataOnHearing1);
    }
  );

  test.describe('Contested - General Application Directions (MH)', () => {
    // non-prod only
    test(
      'General Application Directions (MH) with hearing',
      { tag: [] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsMHPage,
        checkYourAnswersPage,
        axeUtils,
      },
        testInfo) => {
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
        await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
        await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
        await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
        await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
        await performNewGeneralApplicationDirectionsFlowWithHearing(
          caseDetailsPage,
          generalApplicationDirectionsMHPage,
          checkYourAnswersPage,
          testInfo,
          axeUtils
        );
      }
    );
    test(
      'Paper case - General Application Directions (MH) with hearing ',
      { tag: [] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsMHPage,
        checkYourAnswersPage,
        axeUtils,
      },
        testInfo
      ) => {
        const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
        await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
        await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
        await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
        await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
        await performNewGeneralApplicationDirectionsFlowWithHearing(
          caseDetailsPage,
          generalApplicationDirectionsMHPage,
          checkYourAnswersPage,
          testInfo,
          axeUtils
        );
      }
    );
  });
}); 
