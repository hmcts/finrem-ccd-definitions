import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { paymentDetailsTabData } from '../../../data/tab_content/payment_details_tabs';
import { ListForHearingPage } from '../../../pages/events/list-for-hearing/ListForHearingPage';

test(
  'Contested - List for Hearing express case',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      solicitorAuthPage,
      helpWithFeesPage,
      paymentPage,
      orderSummaryPage,
      caseSubmissionPage,
      listForHearingPage
    },
  ) => {
    // Set up court information.
    const hearingType: string = "Final Hearing (FH)";
    const courtName: string = "CHESTERFIELD COUNTY COURT";
    

    const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/contested/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
    await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyContested', 'FR_applicationPaymentSubmission', './playwright-e2e/data/payload/contested/solicitor/case-submission.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_HWFDecisionMade', './playwright-e2e/data/payload/contested/caseworker/HWF-application-accepted.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_issueApplication', './playwright-e2e/data/payload/contested/caseworker/issue-application.json');
    await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyContested', 'FR_progressToSchedulingAndListing', './playwright-e2e/data/payload/contested/caseworker/progress-to-listing.json');
    console.log('caseId:', caseId);

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // list for hearing
    await caseDetailsPage.selectNextStep(contestedEvents.listForHearing); 
    await listForHearingPage.selectTypeOfHearingDropDown (hearingType);
    await listForHearingPage.enterTimeEstimate('1 hour');
    await listForHearingPage.enterHearingDate();
    await listForHearingPage.verifyHearingDateGuidanceMessages() // This checks the hearing date guidance messages for fast track, express and standard 
    await listForHearingPage.enterHearingTime('10:00');
    await listForHearingPage.selectCourtForHearing(courtName);
    await listForHearingPage.navigateContinue();
    await listForHearingPage.navigateSubmit();
    await listForHearingPage.verifyHearingDateWarningMessage('expressPilot'); // This checks the express pilot hearing date warning message

    await caseDetailsPage.checkHasBeenUpdated('List for Hearing');
   

    
  }
);
