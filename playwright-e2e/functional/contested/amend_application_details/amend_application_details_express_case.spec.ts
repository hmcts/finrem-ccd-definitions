import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { contestedEvents } from '../../../config/case_events';
import { expressDoesNotQualifyCaseGateKeepingTabData } from '../../../data/tab_content/contested/express_case_not_qualify_gatekeeping_tab';
import { expressCaseGateKeepingTabData } from '../../../data/tab_content/contested/express_case_gatekeeping_tab';
import { createCaseTabData } from '../../../data/tab_content/contested/solicitor_create_case_tabs';
import { ExpressCasePage } from '../../../pages/events/amend-application-details/ExpressCasePage';
import { ExpressCaseEnrolledPage } from '../../../pages/events/create-case/ExpressCaseEnrolledPage';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { StartPage } from '../../../pages/events/create-case/StartPage';
import { NatureOfApplicationPage } from '../../../pages/events/create-case/NatureOfApplicationPage';
import { UploadOrderDocumentsPage } from '../../../pages/events/create-case/UploadOrderDocumentPage';
import { CreateCaseCheckYourAnswersPage } from '../../../pages/events/create-case/CreateCaseCheckYourAnswersPage';
import { createCaseWithExpressPilot } from '../../helpers/ExpressPilotHelper';
import { TestInfo } from 'playwright/test';

async function createAndProcessFormACase(isExpressPilot: boolean = false): Promise<string> {
  const caseId = await createCaseWithExpressPilot(
    config.applicant_solicitor.email,
    config.applicant_solicitor.password,
    './playwright-e2e/data/payload/contested/forma/ccd-contested-base.json',
    'FinancialRemedyContested',
    'FR_solicitorCreate',
    isExpressPilot
  );
  return caseId;
}

const enum ExpressTestType {
  TestingForExpressExit = "Testing for content to say that the case is no longer express",
  TestingForExpressEntry = "Testing for content to say that the case is express",
  TestForNoExpressContent = "Testing that no content related to express is shown",
}

async function performAmendApplicationDetailsFlowForExpressPilot(
  caseId: string,
  expressTestType: ExpressTestType,
  loginPage: any,
  manageCaseDashboardPage: ManageCaseDashboardPage,
  caseDetailsPage: CaseDetailsPage,
  startPage: StartPage,
  natureOfApplicationPage: NatureOfApplicationPage,
  expressCasePage: ExpressCasePage,
  expressCaseEnrolledPage: ExpressCaseEnrolledPage,
  uploadOrderDocumentsPage: UploadOrderDocumentsPage,
  createCaseCheckYourAnswersPage: CreateCaseCheckYourAnswersPage,
  testInfo: TestInfo,
  makeAxeBuilder: any
): Promise<void> {
  await manageCaseDashboardPage.visit();
  await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);

  await startPage.navigateContinue();

  // Applicant representation
  await startPage.navigateContinue();

  // Divorce / Dissolution details
  await startPage.navigateContinue();

  // Enter Applicant's name and address
  await startPage.navigateContinue();

  // Enter respondent names
  await startPage.navigateContinue();

  // Respondent's representation details
  await startPage.navigateContinue();

  // Nature of App - Select Variation order if testing that we exit Express Pilot
  if (ExpressTestType.TestingForExpressExit == expressTestType) {
    await natureOfApplicationPage.selectVariationOrderOnly();
  }
  await natureOfApplicationPage.navigateContinue();
  
  // Select Fast Track No
  await startPage.navigateContinue();

  // Complete complexity list and assets details
  await startPage.navigateContinue();

  // Complete court details
  await startPage.navigateContinue();

  // Check the express page, depending on what you are testing
  switch (expressTestType) {
    case ExpressTestType.TestingForExpressExit:
      await expressCasePage.checkExitContent();
      await expressCasePage.navigateContinue();
      break;
    case ExpressTestType.TestingForExpressEntry:
      await expressCaseEnrolledPage.checkLinkResolves();
      await expressCasePage.navigateContinue();
      break;
    case ExpressTestType.TestForNoExpressContent:
      // no express page shown, test resumes from next page in journey.
      break;
  }

  // Complete MIAM Yes/No
  await startPage.navigateContinue();

  // Complete MIAM certification details
  await startPage.navigateContinue();

  // Upload variation Order Document
  await uploadOrderDocumentsPage.uploadVariationOrderDoc();
  await uploadOrderDocumentsPage.navigateContinue();
  
  await uploadOrderDocumentsPage.navigateContinue();
  await createCaseCheckYourAnswersPage.navigateSubmit();

  await caseDetailsPage.checkHasBeenUpdated('Amend Application Details');

  // Assert case creation tab data
  await caseDetailsPage.assertTabData(createCaseTabData);

  // Check the express part of the gatekeeping and allocation tab, depending on what you are testing
  switch (expressTestType) {
    case ExpressTestType.TestingForExpressExit:
      await caseDetailsPage.assertTabData(expressDoesNotQualifyCaseGateKeepingTabData);
      break;
    case ExpressTestType.TestingForExpressEntry:
      await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
      break;
    case ExpressTestType.TestForNoExpressContent:
      await caseDetailsPage.assertTabData(expressDoesNotQualifyCaseGateKeepingTabData);
      break;
  }

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

test.describe('Contested - Amend Application Details join/exit express case Form A', () => {
   test(
    'Contested Form A - Amend Application Details. Exit Express Pilot content shown.  Amendment added a Variation Order, so criteria not met.',
     { tag: [] },
     async (
       {
         loginPage,
         manageCaseDashboardPage,
         caseDetailsPage,
         startPage,
         natureOfApplicationPage,
         expressCasePage,
         expressCaseEnrolledPage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const isAnExpressCase = true;
       const caseId = await createAndProcessFormACase(isAnExpressCase);
       const testingForExitingPilot = true;
       await performAmendApplicationDetailsFlowForExpressPilot(caseId, ExpressTestType.TestingForExpressExit, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage,
        natureOfApplicationPage, expressCasePage, expressCaseEnrolledPage, uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );

   test(
    'Contested Form A - Amend Application Details. Entering the Express Pilot content shown. The case still qualifies.',
     { tag: [] },
     async (
       {
         loginPage,
         manageCaseDashboardPage,
         caseDetailsPage,
         startPage,
         natureOfApplicationPage,
         expressCasePage,
         expressCaseEnrolledPage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const isAnExpressCase = true;
       const caseId = await createAndProcessFormACase(isAnExpressCase);
       const testingForExitingPilot = false;
       await performAmendApplicationDetailsFlowForExpressPilot(caseId, ExpressTestType.TestingForExpressEntry, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage,
        natureOfApplicationPage, expressCasePage, expressCaseEnrolledPage, uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );

   test(
    'Contested Form A - Amend Application Details. No Express Pilot content should be shown.  The case did not qualify before and still does not.',
     { tag: [] },
     async (
       {
         loginPage,
         manageCaseDashboardPage,
         caseDetailsPage,
         startPage,
         natureOfApplicationPage,
         expressCasePage,
         expressCaseEnrolledPage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const isAnExpressCase = true;
       const caseId = await createAndProcessFormACase(false);
       const testingForExitingPilot = false;
       await performAmendApplicationDetailsFlowForExpressPilot(caseId, ExpressTestType.TestForNoExpressContent, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage,
        natureOfApplicationPage, expressCasePage, expressCaseEnrolledPage, uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );
});
