import { caseAssignmentApi, test } from '../../fixtures/fixtures.ts';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { DateHelper } from '../../data-utils/DateHelper.ts';
import config from '../../config/config.ts';
import { CommonEvents } from '../../config/case-data.ts';
import { CaseTypeEnum, YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums.ts';
import { applicantStopRepresentingClientTable, intervenerStopRepresentingClientTable, respondentStopRepresentingClientTable } from '../../resources/check_your_answer_content/stop-representing-client/stopRepresentingClientTable.ts';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory.ts';
import { ContestedEventApi } from '../../data-utils/api/contested/ContestedEventApi.ts';

const stopRepresentingClientTestData = [
  {
    title: 'Consented - App Solicitor Stop representing a client event',
    user: config.applicant_solicitor,
    selectApplicant: true,
    isConsented: true,
    addBarrister: false,
    isIntervener: false
  },
  // {
  //   title: 'Consented - Respondent Solicitor Stop representing a client event',
  //   user: config.respondent_solicitor,
  //   selectApplicant: false,
  //   isConsented: true,
  //   addBarrister: false
  // },
  {
    title: 'Contested - App Solicitor Stop representing a client event',
    user: config.applicant_solicitor,
    selectApplicant: true,
    isConsented: false,
    addBarrister: false,
    isIntervener: false
  }
  // {
  //   title: 'Contested - Applicant Barrister Stop representing a client event',
  //   user: config.applicant_barrister,
  //   selectApplicant: true,
  //   isConsented: false,
  //   addBarrister: true
  //   isIntervener: false
  // },
  // {
  //   title: 'Contested - Respondent Solicitor Stop representing a client event',
  //   user: config.respondent_solicitor,
  //   selectApplicant: false,
  //   isConsented: false,
  //   addBarrister: false
  //   isIntervener: false
  // },
  // {
  //   title: 'Contested - Respondent Barrister Stop representing a client event',
  //   user: config.respondent_barrister,
  //   selectApplicant: false,
  //   isConsented: false,
  //   addBarrister: true
  //   isIntervener: false

  // },
  // {
  //   title: 'Contested - Applicant Intervener Stop representing a client event',
  //   user: config.applicant_intervener,
  //   selectApplicant: true,
  //   isConsented: false,
  //   addBarrister: true,
  //   isIntervener: true
  // },
  // {
  //   title: 'Contested - Respondent Intervener Stop representing a client event',
  //   user: config.respondent_intervener,
  //   selectApplicant: false,
  //   isConsented: false,
  //   addBarrister: true,
  //   isIntervener: true
  // }
];

test.describe('Notice of Change', () => {

  test.skip( // needs to be fixed DFR-4058
    'Applicant sol cannot raise a Notice of Change for respondent', { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, noticeOfChangePage }) => {

      // Create a contested case by applicant solicitor
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false, DateHelper.getCurrentDate());

      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

      // Raise Notice of Change, first attempt with wrong client details,
      await noticeOfChangePage.navigateToNoticeOfChange();
      await noticeOfChangePage.enterOnlineCaseReference(caseId.toString());
      await noticeOfChangePage.navigateContinue();

      await noticeOfChangePage.enterClientsDetails('Frodo', 'Baggi');
      await noticeOfChangePage.navigateContinue();
      await noticeOfChangePage.assertErrorMessageClientDetailsShouldExactlyMatch();

      // second attempt with client already on case,
      await noticeOfChangePage.enterClientsDetails('Frodo', 'Baggins');
      await noticeOfChangePage.navigateContinue();
      await noticeOfChangePage.assertAlreadyHasAccessToCase();

      await noticeOfChangePage.navigateToNoticeOfChange();
      await noticeOfChangePage.enterOnlineCaseReference(caseId.toString());
      await noticeOfChangePage.navigateContinue();

      // third attempt with correct new respondent client details
      await noticeOfChangePage.enterClientsDetails('Smeagol', 'Gollum');
      await noticeOfChangePage.navigateContinue();
      // should NOT go to submit page,
      await noticeOfChangePage.assertCheckAndSubmitPage(caseId.toString(), 'Smeagol', 'Gollum');
      await noticeOfChangePage.checkAllCheckboxes();
      await noticeOfChangePage.navigateSubmit();

      await noticeOfChangePage.assertNoticeOfChangeSuccessMessage(caseId.toString());

    }
  );

  test(
    'CAA can raise a Notice of Change', { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, noticeOfChangePage, caseDetailsPage }) => {

      // Create a contested case by applicant solicitor
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false, DateHelper.getCurrentDate());
      const date = DateHelper.getUtcDateTimeFormatted();
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.applicant_solicitor2.email, config.applicant_solicitor2.password, config.manageCaseBaseURL, config.loginPaths.cases);

      // Raise Notice of Change, first attempt with wrong client details,
      await noticeOfChangePage.navigateToNoticeOfChange();
      await noticeOfChangePage.enterOnlineCaseReference(caseId.toString());
      await noticeOfChangePage.navigateContinue();

      await noticeOfChangePage.enterClientsDetails('Frodo', 'Baggi');
      await noticeOfChangePage.navigateContinue();
      await noticeOfChangePage.assertErrorMessageClientDetailsShouldExactlyMatch();

      // second attempt with client already on case,
      await noticeOfChangePage.enterClientsDetails('Frodo', 'Baggins');
      await noticeOfChangePage.navigateContinue();
      await noticeOfChangePage.assertCheckAndSubmitPage(caseId.toString(), 'Frodo', 'Baggins');
      await noticeOfChangePage.checkAllCheckboxes();

      await noticeOfChangePage.navigateSubmit();

      await noticeOfChangePage.assertNoticeOfChangeSuccessMessage(caseId.toString());

      await manageCaseDashboardPage.navigateToCase(caseId);

      await caseDetailsPage.assertTabData([
        {
          tabName: 'Applicant',
          tabContent: [
            { tabItem: 'Solicitor’s firm', value: 'FinRem-3-Org' },
            { tabItem: 'Last NoC Requested By', value: config.applicant_solicitor2.email },
            'Previous Organisations 1',
            { tabItem: 'From Timestamp', value: date, exact: false },
            { tabItem: 'Organisation Name', value: 'FinRem-1-Org' },
            { tabItem: 'Email', value: config.applicant_solicitor2.email }
          ]
        }
      ]);
    }
  );

  test.describe('Stop representing a client event', () => {
    for (const data of stopRepresentingClientTestData) {
      test(
        data.title, { tag: [] },
        async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, stopRepresentingClientPage, checkYourAnswersPage }) => {
          // Create case
          let caseId;
          if (data.isConsented) {
            caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();
          } else {
            caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
          }

          // Assign Solicitors/barristers/Intervener solicitors as needed
          if (data.isIntervener) {
            await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
            await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
          } else {
            if (data.isConsented && !data.selectApplicant) {
              await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONSENTED);
            }
            if (!data.isConsented && data.addBarrister && data.selectApplicant) {
              await ContestedEventApi.caseworkerAddsApplicantBarrister(caseId);
            }
            if (!data.isConsented && !data.selectApplicant) {
              await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONTESTED);
              if (data.addBarrister) {
                await ContestedEventApi.caseworkerAddsRespondentBarrister(caseId);
              }
            }
          }

          await manageCaseDashboardPage.visit();
          await loginPage.loginWaitForPath(data.user.email, data.user.password, config.manageCaseBaseURL, config.loginPaths.cases);

          await manageCaseDashboardPage.navigateToCase(caseId);

          await caseDetailsPage.selectNextStep(CommonEvents.stopRepresentingClient);

          await stopRepresentingClientPage.enterAddress('NW2 7NE');
          await stopRepresentingClientPage.clickFindAddressButton();
          await stopRepresentingClientPage.selectAddress('10 Selsdon Road, London');

          if (data.selectApplicant && !data.isIntervener) {
            await stopRepresentingClientPage.selectApplicantDetailsPrivate(YesNoRadioEnum.YES);
          } else if (data.isIntervener) {
            await stopRepresentingClientPage.selectIntervenerDetailsPrivate(YesNoRadioEnum.YES);
          } else {
            await stopRepresentingClientPage.selectRespondentDetailsPrivate(YesNoRadioEnum.NO);
          }

          await stopRepresentingClientPage.consentToStopRepresentingClient(YesNoRadioEnum.NO);
          await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.NO);
          await stopRepresentingClientPage.navigateContinue();

          // Assert error message is shown for missing judicial approval or client consent
          await stopRepresentingClientPage.assertMissingClientOrJudicialApprovalError();

          await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.YES);
          await stopRepresentingClientPage.navigateContinue();

          // check your answers
          if (data.selectApplicant && !data.isIntervener) {
            await checkYourAnswersPage.assertCheckYourAnswersPage(applicantStopRepresentingClientTable);
          }
          else if (data.isIntervener) {
            await checkYourAnswersPage.assertCheckYourAnswersPage(intervenerStopRepresentingClientTable);
          }
          else {
            await checkYourAnswersPage.assertCheckYourAnswersPage(respondentStopRepresentingClientTable);
          }
          
          await stopRepresentingClientPage.navigateSubmit();

          // Assert are you sure text is shown
          await stopRepresentingClientPage.assertAreYouSureYouWishToStopRepresentingText();
          await stopRepresentingClientPage.navigateIgnoreWarningAndGo();

          await manageCaseDashboardPage.navigateToCase(caseId, false); // verify solicitor/barrister/intervener no longer has access to case

          await manageCaseDashboardPage.signOut();

          // Try to login as barrister after intervener removal
          if (data.isIntervener) {
            // Determine which barrister to use based on selectApplicant
            const barristerUser = data.selectApplicant
              ? config.applicant_barrister
              : config.respondent_barrister;

            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(
              barristerUser.email,
              barristerUser.password,
              config.manageCaseBaseURL,
              config.loginPaths.cases
            );
            // Try to navigate to the case and assert access is denied            
            await manageCaseDashboardPage.navigateToCase(caseId, false);
                    
          }
        }
      );
    }
  });
});