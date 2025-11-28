import {caseAssignmentApi, test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from '../../../config/case-data.ts';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { vacateHearingNotRelistedTableData, vacateHearingRelistedTableData } from '../../../resources/check_your_answer_content/manage_hearings/manageHearingVacateHearingTable.ts';
import { getManageHearingTabData } from '../../../resources/tab_content/contested/manage_hearing_tabs.ts';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi.ts';
import { CaseTypeEnum } from '../../../pages/helpers/enums/RadioEnums.ts';

test.describe('Contested - Vacate Hearings', () => {

  test('Contested - Vacate Hearing - Not Relisted',
    { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case up to issue application
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      //navigate to manage hearings event
      await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);

      //select hearing and vacate hearing
      await manageHearingPage.selectVacateHearing();
      await manageHearingPage.selectHearingToVacate(1); //selects first hearing
      await manageHearingPage.fillVacateHearingDate('12', '12', '2025');
      await manageHearingPage.whyIsTheHearingBeingVacated('Other - Please specify');
      await manageHearingPage.specifyOtherReasonForVacatingHearing('The hearing is no longer required');
      await manageHearingPage.navigateContinue();
      await axeUtils.audit();

      //will you be relisting question
      await manageHearingPage.willYouBeRelistingQuestion('no');
      await manageHearingPage.navigateContinue();

      //check your answers page
      await checkYourAnswersPage.assertCheckYourAnswersPage(vacateHearingNotRelistedTableData); 
      await manageHearingPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);
    });

  test('Contested - Vacate Hearing - Relisted',
    { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case up to issue application
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
      await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
      await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
      await ContestedEventApi.caseworkerAddsApplicantBarrister(caseId);
      await ContestedEventApi.caseworkerAddsRespondentBarrister(caseId);
      await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONTESTED);

      // Login as caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      //navigate to manage hearings event
      await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);

      //select hearing and vacate hearing
      await manageHearingPage.selectVacateHearing();
      await manageHearingPage.selectHearingToVacate(1); //selects first hearing
      await manageHearingPage.fillVacateHearingDate('12', '12', '2025');
      await manageHearingPage.whyIsTheHearingBeingVacated('Other - Please specify');
      await manageHearingPage.specifyOtherReasonForVacatingHearing('The hearing is no longer required');
      await manageHearingPage.navigateContinue();
      await axeUtils.audit();

      //will you be relisting question
      await manageHearingPage.willYouBeRelistingQuestion('yes');
      await manageHearingPage.navigateContinue();

      // add a hearing
      await manageHearingPage.addHearing({
        type: 'Pre-Trial Review (PTR)',
        duration: '2 hours',
        date: {},
        time: '10:00 AM',
        court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
        attendance: 'Remote - video call',
        additionalInformation: 'Hearing details here',
        uploadAnySupportingDocuments: true,
        uploadFiles: ['final_hearing_file1.pdf'],
        sendANoticeOfHearing: true,
        whoShouldSeeOrder: [
          { partyType: 'Applicant', partyName: 'Frodo Baggins' },
          { partyType: 'Respondent', partyName: 'Smeagol Gollum' },
          { partyType: 'Intervener1', partyName: 'intApp1' },
          { partyType: 'Intervener2', partyName: 'intResp1' }
        ]
      });
      await axeUtils.audit({
        exclude :[
          '#workingHearing_additionalHearingDocs_0',
          '#workingHearing_additionalHearingDocs_1'
        ]
      });
      await manageHearingPage.navigateContinue();

      //check your answers page
      await checkYourAnswersPage.assertCheckYourAnswersPage(vacateHearingRelistedTableData); 
      await manageHearingPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);

      await caseDetailsPage.assertTabData([getManageHearingTabData({
        typeOfHearing: 'Pre-Trial Review (PTR)',
        court: 'Central Family Court',
        attendance: 'Remote - Video call',
        hearingTime: '10:00 AM',
        duration: '2 hours',
        whoShouldSeeOrder: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum, Intervener1 - intApp1, Intervener2 - intResp1',
        additionalInformation: 'Hearing details here',
        uploadFiles: ['HearingNotice.pdf', 'final_hearing_file1.pdf']
      })]);
    });
});
