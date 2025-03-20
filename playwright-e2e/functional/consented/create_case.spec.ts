import { test, expect } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseTabData, createCaseTabDataPreview, createCaseTabDataDemo } from '../../data/tab_content/consented/create_case_tabs';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';

test(
  'Consented - Create Case',
  { tag: ['@accessibility'] },
  async (
    { loginPage,
      manageCaseDashboardPage,
      createCasePage,
      startPage,
      solicitorDetailsPage,
      divorceDetailsPage,
      applicantDetailsPage,
      financialRemedyCourtPage,
      respondentDetailsPage,
      respondentRepresentedPage,
      natureOfApplicationPage,
      periodicalPaymentsPage,
      uploadOrderDocumentsPage,
      createCaseCheckYourAnswersPage,
      caseDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Sign in
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);

    // Start the consented case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.consented,
      config.eventType.consentOrder
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented);
    await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsConsented('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue();

    //applicant details
    await applicantDetailsPage.enterApplicantDetailsConsented('Frodo', 'Baggins');
    await financialRemedyCourtPage.selectCourtZoneDropDown('COVENTRY COMBINED COURT CENTRE');
    await applicantDetailsPage.navigateContinue();

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Gollum', 'Smeagol');
    await respondentRepresentedPage.selectRespondentRepresentedConsented(false);
    await respondentDetailsPage.enterRespondentAddress();
    await respondentDetailsPage.navigateContinue();

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await natureOfApplicationPage.navigateContinue();

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsConsented(false);
    await periodicalPaymentsPage.navigateContinue();

    // Upload variation Order Document
    await uploadOrderDocumentsPage.uploadConsentOrder();
    await uploadOrderDocumentsPage.navigateContinue();
    await uploadOrderDocumentsPage.selectAndUploadJointD81(false);

    // Continue through optional uploads
    await uploadOrderDocumentsPage.navigateContinue();
    await uploadOrderDocumentsPage.navigateContinue();
    await uploadOrderDocumentsPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.navigateContinue();
    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();
    
    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);

    if (config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json'
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }
);

test(
  'Consented - Caseworker view tabs post case creation',
  { tag: ['@preview'] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage
    }
  ) => {
    const isDemoEnv = process.env.RUNNING_ENV === 'demo';
    const caseDataFile = isDemoEnv ? './test/data/ccd-demo-consented-basic-data.json' : './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json';
    const expectedTabData = isDemoEnv ? createCaseTabDataDemo : createCaseTabDataPreview;
    const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseDataFile, 'FinancialRemedyMVP2', 'FR_solicitorCreate');
    const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
    const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', caseDataFile);
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    // Assert tab data
    await caseDetailsPage.assertTabData(expectedTabData);
    });
