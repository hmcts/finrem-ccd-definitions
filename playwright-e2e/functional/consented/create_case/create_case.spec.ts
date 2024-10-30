import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config';

test(
  'Smoke Test - Consented Journey Submission',
  { tag: ['@smoke-test', '@accessibility'] },
  async (
    { loginPage,
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
      checkYourAnswersPage,
      caseDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Sign in
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
    await solicitorDetailsPage.enterSolicitorDetails('Test App Sol', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented)
    await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsConsented('LV12D12345', config.divorceStage.petitionIssued)
    await divorceDetailsPage.navigateContinue();

    //applicant details
    await applicantDetailsPage.enterApplicantDetailsConsented('App First Name', 'App Last Name');
    await financialRemedyCourtPage.selectCourtZoneDropDown();
    await applicantDetailsPage.navigateContinue();

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Resp First Name', 'Resp Last Name');
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
    await checkYourAnswersPage.navigateContinue();
    await checkYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

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

