import { caseAssignmentApi, test } from '../../fixtures/fixtures.ts';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { DateHelper } from '../../data-utils/DateHelper.ts';
import config from '../../config/config.ts';
import { CommonEvents } from '../../config/case-data.ts';
import { CaseTypeEnum, YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums.ts';
import { applicantStopRepresentingClientTable, respondentStopRepresentingClientTable } from '../../resources/check_your_answer_content/stop-representing-client/stopRepresentingClientTable.ts';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory.ts';

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
  ); // <-- semicolon added here

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
    test(
      'Consented - App Solicitor Stop representing a client event', { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, stopRepresentingClientPage, checkYourAnswersPage }) => {

        // Create a contested case by applicant solicitor
        const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep((CommonEvents.stopRepresentingClient));

        await stopRepresentingClientPage.enterAddress('NW2 7NE');
        await stopRepresentingClientPage.clickFindAddressButton();
        await stopRepresentingClientPage.selectAddress('10 Selsdon Road, London');
        await stopRepresentingClientPage.selectApplicantDetailsPrivate(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.consentToStopRepresentingClient(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.navigateContinue();
        
        // Assert error message is shown for missing judicial approval or client consent
        await stopRepresentingClientPage.assertMissingClientOrJudicialApprovalError();
        
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.navigateContinue();

        // check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(applicantStopRepresentingClientTable);
        await stopRepresentingClientPage.navigateSubmit();

        // Assert are you sure text is shown
        await stopRepresentingClientPage.assertAreYouSureYouWishToStopRepresentingText();
        await stopRepresentingClientPage.navigateIgnoreWarningAndGo();

        await manageCaseDashboardPage.navigateToCase(caseId, false); // verify solicitor no longer has access to case
      }
    );
    test(
      'Consented - Respondent Solicitor Stop representing a client event', { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, stopRepresentingClientPage, checkYourAnswersPage }) => {  
        // Create a consented case
        const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();
        await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONSENTED);
         
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep((CommonEvents.stopRepresentingClient));
        await stopRepresentingClientPage.enterAddress('NW2 7NE');
        await stopRepresentingClientPage.clickFindAddressButton();
        await stopRepresentingClientPage.selectAddress('10 Selsdon Road, London');
        await stopRepresentingClientPage.selectRespondentDetailsPrivate(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.consentToStopRepresentingClient(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.navigateContinue();
        
        // Assert error message is shown for missing judicial approval or client consent
        await stopRepresentingClientPage.assertMissingClientOrJudicialApprovalError();
        
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.navigateContinue();
        // check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(respondentStopRepresentingClientTable);
        await stopRepresentingClientPage.navigateSubmit();

        // Assert are you sure text is shown
        await stopRepresentingClientPage.assertAreYouSureYouWishToStopRepresentingText();
        await stopRepresentingClientPage.navigateIgnoreWarningAndGo();

        await manageCaseDashboardPage.navigateToCase(caseId, false); // verify solicitor no longer has access to case
      }
    );
    test(
      'Contested - App Solicitor Stop representing a client event', { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, stopRepresentingClientPage, checkYourAnswersPage }) => {

        // Create a contested case by applicant solicitor
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep((CommonEvents.stopRepresentingClient));

        await stopRepresentingClientPage.enterAddress('NW2 7NE');
        await stopRepresentingClientPage.clickFindAddressButton();
        await stopRepresentingClientPage.selectAddress('10 Selsdon Road, London');
        await stopRepresentingClientPage.selectApplicantDetailsPrivate(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.consentToStopRepresentingClient(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.navigateContinue();
        
        // Assert error message is shown for missing judicial approval or client consent
        await stopRepresentingClientPage.assertMissingClientOrJudicialApprovalError();
        
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.navigateContinue();

        // check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(applicantStopRepresentingClientTable);
        await stopRepresentingClientPage.navigateSubmit();

        // Assert are you sure text is shown
        await stopRepresentingClientPage.assertAreYouSureYouWishToStopRepresentingText();
        await stopRepresentingClientPage.navigateIgnoreWarningAndGo();

        await manageCaseDashboardPage.navigateToCase(caseId, false); // verify solicitor no longer has access to case
      }
    );
    test(
      'Contested - Respondent Solicitor Stop representing a client event', { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, stopRepresentingClientPage, checkYourAnswersPage }) => {  
        // Create a contested case
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
        await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONSENTED);
         
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.respondent_solicitor.email, config.respondent_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep((CommonEvents.stopRepresentingClient));
        await stopRepresentingClientPage.enterAddress('NW2 7NE');
        await stopRepresentingClientPage.clickFindAddressButton();
        await stopRepresentingClientPage.selectAddress('10 Selsdon Road, London');
        await stopRepresentingClientPage.selectRespondentDetailsPrivate(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.consentToStopRepresentingClient(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.NO);
        await stopRepresentingClientPage.navigateContinue();
        
        // Assert error message is shown for missing judicial approval or client consent
        await stopRepresentingClientPage.assertMissingClientOrJudicialApprovalError();
        
        await stopRepresentingClientPage.selectJudicialApprovalQuestion(YesNoRadioEnum.YES);
        await stopRepresentingClientPage.navigateContinue();
        // check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(respondentStopRepresentingClientTable);
        await stopRepresentingClientPage.navigateSubmit();

        // Assert are you sure text is shown
        await stopRepresentingClientPage.assertAreYouSureYouWishToStopRepresentingText();
        await stopRepresentingClientPage.navigateIgnoreWarningAndGo();

        await manageCaseDashboardPage.navigateToCase(caseId, false); // verify solicitor no longer has access to case
      }
    );
  }); 
});