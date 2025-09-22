import {test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {ContestedEvents} from '../../../config/case-data';
import {YesNoRadioEnum} from '../../../pages/helpers/enums/RadioEnums';
import {AxeUtils} from "../../../fixtures/utils/axe-utils.ts";
import {ContestedEventApi} from '../../../data-utils/api/contested/ContestedEventApi.ts';
import {
  contestedGeneralApplicationDirectionsMHTableData
} from '../../../resources/check_your_answer_content/general_applcations_directions/generalApplicationDirectionsMHTable.ts';
import {
  GeneralApplicationDirectionsPage
} from "../../../pages/events/general-application-directions/GeneralApplicationDirectionsPage.ts";

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performNewGeneralApplicationDirectionsFlowWithHearing(
  caseDetailsPage: any,
  generalApplicationDirectionsPage: GeneralApplicationDirectionsPage,
  checkYourAnswersPage: any,
  axeUtils: AxeUtils
): Promise<void> {
  await caseDetailsPage.selectNextStep(ContestedEvents.generalApplicationDirections);
  await generalApplicationDirectionsPage.chooseWhetherAHearingIsRequired(YesNoRadioEnum.YES);
  await generalApplicationDirectionsPage.selectTypeOfHearing('Application Hearing');
  await generalApplicationDirectionsPage.enterTimeEstimate('3 hours');
  await generalApplicationDirectionsPage.enterHearingDate('01', '01', '2025');
  await generalApplicationDirectionsPage.enterHearingTime('10:00');
  await generalApplicationDirectionsPage.selectCourtForHearing();
  await generalApplicationDirectionsPage.selectHearingAttendance('Remote - video call');
  await generalApplicationDirectionsPage.enterAdditionalInformationAboutHearing('This is a test hearing');
  await generalApplicationDirectionsPage.selectAdditionalHearingDocument(YesNoRadioEnum.YES);
  await generalApplicationDirectionsPage.uploadOtherDocuments('test.doc');
  await generalApplicationDirectionsPage.selectSendNoticeOfHearing(YesNoRadioEnum.NO);
  await generalApplicationDirectionsPage.navigateContinue();
  await generalApplicationDirectionsPage.verifyErrorMessageForNoNotice();
  await generalApplicationDirectionsPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
  await generalApplicationDirectionsPage.unSelectWhoShouldSeeThisOrder('Applicant', 'Frodo Baggins');
  await generalApplicationDirectionsPage.unSelectWhoShouldSeeThisOrder('Respondent', 'Smeagol Gollum');
  await generalApplicationDirectionsPage.selectWhoShouldSeeThisOrder('Intervener1', 'IntApp1');
  await generalApplicationDirectionsPage.navigateContinue();
  await generalApplicationDirectionsPage.verifyApplicantAndRespondentNotSelectedToReceiveNoticeError();

  await generalApplicationDirectionsPage.selectAllWhoShouldSeeThisOrder([
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
  await generalApplicationDirectionsPage.navigateContinue();
  await checkYourAnswersPage.assertCheckYourAnswersPage(contestedGeneralApplicationDirectionsMHTableData);
  await generalApplicationDirectionsPage.navigateSubmit();
}

  test.describe('Contested - General Application Directions (MH)', () => {
    test(
      'General Application Directions (MH) with hearing',
      { tag: [] },
      async ({
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        generalApplicationDirectionsPage,
        checkYourAnswersPage,
        axeUtils,
      },) => {
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
        await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
        await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
        await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
        await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
        await performNewGeneralApplicationDirectionsFlowWithHearing(
          caseDetailsPage,
          generalApplicationDirectionsPage,
          checkYourAnswersPage,
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
        generalApplicationDirectionsPage,
        checkYourAnswersPage,
        axeUtils,
      },

      ) => {
        const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
        await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
        await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
        await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
        await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
        await performNewGeneralApplicationDirectionsFlowWithHearing(
          caseDetailsPage,
          generalApplicationDirectionsPage,
          checkYourAnswersPage,
          axeUtils
        );
      }
    );
   }
  );
