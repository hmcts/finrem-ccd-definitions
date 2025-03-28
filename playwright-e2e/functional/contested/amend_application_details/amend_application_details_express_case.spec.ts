import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { expressDoesNotQualifyCaseGateKeepingTabData } from '../../../data/tab_content/contested/express_case_not_qualify_gatekeeping_tab';
import { createCaseTabData } from '../../../data/tab_content/contested/solicitor_create_case_tabs';
import { ExpressCasePage } from '../../../pages/events/amend-application-details/ExpressCasePage';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { StartPage } from '../../../pages/events/create-case/StartPage';
import { NatureOfApplicationPage } from '../../../pages/events/create-case/NatureOfApplicationPage';
import { PropertyAdjustmentPage } from '../../../pages/events/create-case/PropertyAdjustmentPage';
import { PeriodicalPaymentsPage } from '../../../pages/events/create-case/PeriodicalPaymentsPage';
import { WrittenAgreementPage } from '../../../pages/events/create-case/WrittenAgreementPage';
import { UploadOrderDocumentsPage } from '../../../pages/events/create-case/UploadOrderDocumentPage';
import { CreateCaseCheckYourAnswersPage } from '../../../pages/events/create-case/CreateCaseCheckYourAnswersPage';
import { TestInfo } from 'playwright/test';

async function createAndProcessFormAExpressCase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  return caseId;
}

// Todo: use New playwright-e2e/functional/helpers/PayloadHelper.ts when merged.
async function createAndProcessFormACase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-base.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  return caseId;
}

async function performAmendApplicationDetailsFlowToExitExpressPilot(
  caseId: string,
  testingForEnteringPilot: boolean,
  loginPage: any,
  manageCaseDashboardPage: ManageCaseDashboardPage,
  caseDetailsPage: CaseDetailsPage,
  startPage: StartPage,
  natureOfApplicationPage: NatureOfApplicationPage,
  propertyAdjustmentPage: PropertyAdjustmentPage,
  periodicalPaymentsPage: PeriodicalPaymentsPage,
  writtenAgreementPage: WrittenAgreementPage,
  expressCasePage: ExpressCasePage,
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

  // Nature of App - Select Variation order to exit Express Pilot
  await natureOfApplicationPage.selectNatureOfApplication();
  await natureOfApplicationPage.navigateContinue();

  // Property Adjustment Order
  await propertyAdjustmentPage.propertyAdjustmentOrder();
  await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
  await propertyAdjustmentPage.navigateContinue();

  // Periodical Payments
  await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
  await periodicalPaymentsPage.navigateContinue();

  // Written Agreement
  await writtenAgreementPage.selectWrittenAgreement(false);
  await writtenAgreementPage.navigateContinue();
  
  // Select Fast Track No
  await startPage.navigateContinue();

  // Complete complexity list and assets details
  await startPage.navigateContinue();

  // Complete court details
  await startPage.navigateContinue();

  // Express Pilot exit page
  if (testingForEnteringPilot) {
    // todo
  } else {
    await expressCasePage.checkExitContent();
    await expressCasePage.navigateContinue();
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
  await caseDetailsPage.assertTabData(expressDoesNotQualifyCaseGateKeepingTabData);

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
         propertyAdjustmentPage,
         periodicalPaymentsPage,
         writtenAgreementPage,
         expressCasePage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const caseId = await createAndProcessFormACase();
       const testingForEnteringPilot = false;
       await performAmendApplicationDetailsFlowToExitExpressPilot(caseId, testingForEnteringPilot, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage, 
        natureOfApplicationPage, propertyAdjustmentPage, periodicalPaymentsPage, writtenAgreementPage, expressCasePage, uploadOrderDocumentsPage, 
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
         propertyAdjustmentPage,
         periodicalPaymentsPage,
         writtenAgreementPage,
         expressCasePage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const caseId = await createAndProcessFormACase();
       const testingForEnteringPilot = true;
       await performAmendApplicationDetailsFlowToExitExpressPilot(caseId, testingForEnteringPilot, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage, 
        natureOfApplicationPage, propertyAdjustmentPage, periodicalPaymentsPage, writtenAgreementPage, expressCasePage, uploadOrderDocumentsPage, 
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );
});
