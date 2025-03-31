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

async function performAmendApplicationDetailsFlowForExpressPilot(
  caseId: string,
  testingForExitingPilot: boolean,
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
  if (testingForExitingPilot) {
    await natureOfApplicationPage.selectVariationOrderOnly();
  }
  await natureOfApplicationPage.navigateContinue();
  
  // Select Fast Track No
  await startPage.navigateContinue();

  // Complete complexity list and assets details
  await startPage.navigateContinue();

  // Complete court details
  await startPage.navigateContinue();

  // If testing for Exit page, look for the Express Pilot exit page
  if (testingForExitingPilot) {
    await expressCasePage.checkExitContent();
    await expressCasePage.navigateContinue();
  } else {
    await expressCaseEnrolledPage.checkLinkResolves();
    await expressCaseEnrolledPage.navigateContinue();
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

  // Assert tab data
  if (testingForExitingPilot) {
    await caseDetailsPage.assertTabData(expressDoesNotQualifyCaseGateKeepingTabData);
  } else {
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
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
    'Contested - Amend Application Details exit Express Pilot through Variation Order (Form A)',
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
       await performAmendApplicationDetailsFlowForExpressPilot(caseId, testingForExitingPilot, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage,
        natureOfApplicationPage, expressCasePage, expressCaseEnrolledPage, uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );

   test(
    'Contested - Amend Application Details join Express Pilot (Form A)',
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
       await performAmendApplicationDetailsFlowForExpressPilot(caseId, testingForExitingPilot, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage,
        natureOfApplicationPage, expressCasePage, expressCaseEnrolledPage, uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );
});
