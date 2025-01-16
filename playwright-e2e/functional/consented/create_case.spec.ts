import { test, expect } from '../../fixtures/fixtures';
import config from '../../config/config';

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
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);

    // Start the consented case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.consented,
      config.eventType.consentOrder
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Bagins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented);
    await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsConsented('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue();

    //applicant details
    await applicantDetailsPage.enterApplicantDetailsConsented('Frodo', 'Baggins');
    await financialRemedyCourtPage.selectCourtZoneDropDown();
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
    await // new step 
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
  'Create Case - validate_app_org_id, error when Organisation ID is empty for Applicant Solicitor consented',
  { tag: ['@accessibility'] },
  async (
    { loginPage,
      manageCaseDashboardPage,
      createCasePage,
      startPage,
      solicitorDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Sign in
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);

    // Start the consented case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.consented,
      config.eventType.consentOrder
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.setApplicantRepresentation(true);
    await solicitorDetailsPage.enterFirmName('Finrem-1-Org');
    await solicitorDetailsPage.enterUKaddress();
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Bagins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented)
    await solicitorDetailsPage.navigateContinue();
    
    //Expect error validation for Organisation ID
    await solicitorDetailsPage.assertOrganisationIdRequired();

    if (config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }
)
