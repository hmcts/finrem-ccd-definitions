import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';
import { expressDoesNotQualifyCaseGateKeepingTabData } from '../../../data/tab_content/contested/express_case_not_qualify_gatekeeping_tab';
import { createCaseTabData } from '../../../data/tab_content/contested/solicitor_create_case_tabs';

async function createAndProcessFormAExpressCase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  return caseId;
}

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  return caseId;
}

async function performAmendApplicationDetailsFlowToJoinExpressPilot(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  startPage: any,
  natureOfApplicationPage: any,
  propertyAdjustmentPage: any,
  periodicalPaymentsPage: any,
  writtenAgreementPage: any,
  uploadOrderDocumentsPage: any,
  createCaseCheckYourAnswersPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  await manageCaseDashboardPage.visit();
  await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
  await startPage.navigateContinue();
  }


async function performAmendApplicationDetailsFlowToExitExpressPilot(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  startPage: any,
  natureOfApplicationPage: any,
  propertyAdjustmentPage: any,
  periodicalPaymentsPage: any,
  writtenAgreementPage: any,
  expressCaseExitPage: any,
  uploadOrderDocumentsPage: any,
  createCaseCheckYourAnswersPage: any,
  testInfo: any,
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
  await expressCaseExitPage.checkContent();
  await expressCaseExitPage.navigateContinue();

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
         expressCaseExitPage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const caseId = await createAndProcessFormACase();
       await performAmendApplicationDetailsFlowToExitExpressPilot(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage, 
        natureOfApplicationPage, propertyAdjustmentPage, periodicalPaymentsPage, writtenAgreementPage, expressCaseExitPage, uploadOrderDocumentsPage, 
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
         expressCaseExitPage,
         uploadOrderDocumentsPage,
         createCaseCheckYourAnswersPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const caseId = await createAndProcessFormACase();
       await performAmendApplicationDetailsFlowToJoinExpressPilot(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage, 
        natureOfApplicationPage, propertyAdjustmentPage, periodicalPaymentsPage, writtenAgreementPage, uploadOrderDocumentsPage, 
        createCaseCheckYourAnswersPage, testInfo, makeAxeBuilder);
     }
   );
});
