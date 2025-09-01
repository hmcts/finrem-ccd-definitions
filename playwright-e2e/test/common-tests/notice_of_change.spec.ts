import {test} from "../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../data-utils/factory/contested/ContestedCaseFactory.ts";
import {DateHelper} from "../../data-utils/DateHelper.ts";
import config from "../../config/config.ts";

test.describe('Notice of Change', () => {

  test.skip(// needs to be fixed DFR-4058
    'Applicant sol cannot raise a Notice of Change for respondent', { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, noticeOfChangePage,  }) => {

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

    });

    test(
      'CAA can raise a Notice of Change', { tag: [] },
      async ({ loginPage, manageCaseDashboardPage, noticeOfChangePage, caseDetailsPage  }) => {

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
                { tabItem: "Solicitor’s firm", value: "FinRem-3-Org"},
                { tabItem: "Last NoC Requested By", value: config.applicant_solicitor2.email },
                "Previous Organisations 1",
                { tabItem: 'From Timestamp', value: date, exact: false },
                { tabItem: "Organisation Name", value: "FinRem-1-Org" },
                { tabItem: "Email", value: config.applicant_solicitor2.email },
              ]
            }
          ]);
      });
  }
);
