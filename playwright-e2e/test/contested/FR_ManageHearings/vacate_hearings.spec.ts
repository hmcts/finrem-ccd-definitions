import { caseAssignmentApi, test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import { ContestedEvents } from '../../../config/case-data.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { vacateHearingNotRelistedTableData, vacateHearingRelistedTableData } from '../../../resources/check_your_answer_content/manage_hearings/manageHearingVacateHearingTable.ts';
import { getManageHearingTabData, getVacatedHearingTabData } from '../../../resources/tab_content/contested/manage_hearing_tabs.ts';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi.ts';
import { CaseTypeEnum } from '../../../pages/helpers/enums/RadioEnums.ts';

test.describe('Contested - Vacate Hearings', { tag: ['@MH'] }, () => {

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

      //assert tab data
      await caseDetailsPage.assertTabData([
        getVacatedHearingTabData({
          typeOfHearing: 'First Directions Appointment (FDA)',
          vacatedOrAdjournedDate: '12 Dec 2025',
          court: 'Manchester County And Family Court',
          attendance: 'In Person',
          duration: '1hr 20mins',
          whoShouldSeeOrder: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
          additionalInformation: 'This is additional information about the hearing',
          uploadFiles: ['HearingNotice.pdf', 'Form-G.pdf', 'PfdNcdrComplianceLetter.pdf', 'PfdNcdrCoverLetter.pdf', 'OutOfFamilyCourtResolution.pdf', 'Form-C.pdf', 'VacateHearingNotice.pdf', 'Dummy QA copy.doc'],
          reasonForVacating: 'Other - Please specify',
          otherReasonForVacating: 'The hearing is no longer required'
        })
      ]);
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
        court: { zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT' },
        attendance: 'Remote - video call',
        additionalInformation: 'Hearing details here',
        uploadAnySupportingDocuments: true,
        uploadFiles: ['final_hearing_file1.pdf'],
        sendANoticeOfHearing: true,
        whoShouldSeeOrder: [
          { partyType: 'Applicant', partyName: 'Frodo Baggins' },
          { partyType: 'Intervener1', partyName: 'intApp1' },
          { partyType: 'Intervener2', partyName: 'intResp1' }
        ],
        whoShouldNotSeeOrder: [
          { partyType: 'Respondent', partyName: 'Smeagol Gollum' }
        ]
      });
      await axeUtils.audit({
        exclude: [
          '#workingHearing_additionalHearingDocs_0',
          '#workingHearing_additionalHearingDocs_1'
        ]
      });
      await manageHearingPage.navigateContinue();

      //check your answers page
      await checkYourAnswersPage.assertCheckYourAnswersPage(vacateHearingRelistedTableData);
      await manageHearingPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);

      //assert tab data
      const relistedHearingData = getManageHearingTabData({
        typeOfHearing: 'Pre-Trial Review (PTR)',
        court: 'Central Family Court',
        attendance: 'Remote - Video call',
        hearingTime: '10:00 AM',
        duration: '2 hours',
        whoShouldSeeOrder: 'Applicant - Frodo Baggins, Intervener1 - intApp1, Intervener2 - intResp1',
        additionalInformation: 'Hearing details here',
        uploadFiles: ['HearingNotice.pdf', 'VacateHearingNotice.pdf', 'final_hearing_file1.pdf']
      });
      const vacatedData = getVacatedHearingTabData({
        typeOfHearing: 'First Directions Appointment (FDA)',
        vacatedOrAdjournedDate: '12 Dec 2025',
        court: 'Manchester County And Family Court',
        attendance: 'In Person',
        duration: '1hr 20mins',
        whoShouldSeeOrder: 'Applicant - Frodo Baggins, Respondent - Smeagol Gollum',
        additionalInformation: 'This is additional information about the hearing',
        uploadFiles: [
          'HearingNotice.pdf', 'Form-G.pdf', 'PfdNcdrComplianceLetter.pdf', 'PfdNcdrCoverLetter.pdf', 'OutOfFamilyCourtResolution.pdf', 'Form-C.pdf', 'Dummy QA copy.doc'
        ],
        reasonForVacating: 'Other - Please specify',
        otherReasonForVacating: 'The hearing is no longer required'
      });

      // Set position: 1 for all object tab items except the section header
      vacatedData.tabContent = vacatedData.tabContent.map(item => {
        return typeof item === 'object' && item.tabItem && [
          'Type of Hearing',
          'Court',
          'Hearing Attendance',
          'Hearing Date',
          'Hearing Time Estimate',
          'Who has received this notice',
          'Additional information about the hearing',
          'Hearing Documents'
        ].includes(item.tabItem)
          ? { ...item, position: 1 }
          : item;
      }
      );

      await caseDetailsPage.assertTabData([relistedHearingData, vacatedData]);

      await manageCaseDashboardPage.signOut();

      // login as respondent solicitor and verify relistedHearingData is not visible
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(
        config.respondent_solicitor.email,
        config.respondent_solicitor.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabDataNotVisible([
        { tabName: relistedHearingData.tabName, tabContent: [relistedHearingData.tabContent[2]] }
      ]); // checks Pre-Trial Review (PTR)'hearing is not visible 
    }
  );
});
