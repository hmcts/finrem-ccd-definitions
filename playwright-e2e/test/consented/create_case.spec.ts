import { test, expect } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseTabData } from '../../resources/tab_content/consented/create_case_tabs';
import {ConsentedEvents} from "../../config/case-data.ts";

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
    const url = ConsentedEvents.createCase.ccdCallback;
    // Sign in
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

    // Start the consented case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.consented,
      config.eventType.consentOrder
    );

    await startPage.navigateContinue(url, 2);

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented);
    await solicitorDetailsPage.navigateContinue(url, 3);

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsConsented('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue(url, 4);

    //applicant details
    await applicantDetailsPage.enterApplicantDetailsConsented('Frodo', 'Baggins');
    await financialRemedyCourtPage.selectCourtZoneDropDown('COVENTRY COMBINED COURT CENTRE');
    await applicantDetailsPage.navigateContinue(url, 5);

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Gollum', 'Smeagol');
    await respondentRepresentedPage.selectRespondentRepresentedConsented(false);
    await respondentDetailsPage.enterRespondentAddress();
    await respondentDetailsPage.navigateContinue(url, 6);

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await natureOfApplicationPage.addConsentedPropertyAdjustmentDetails();
    await natureOfApplicationPage.navigateContinue(url, 7);

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsConsented(false);
    await periodicalPaymentsPage.navigateContinue(url, 8);

    // Upload variation Order Document
    await uploadOrderDocumentsPage.uploadConsentOrder();
    await uploadOrderDocumentsPage.navigateContinue();
    await uploadOrderDocumentsPage.selectAndUploadJointD81(true);

    // Continue through optional uploads
    await uploadOrderDocumentsPage.navigateContinue(url, 10);
    await uploadOrderDocumentsPage.navigateContinue(url, 11);
    await uploadOrderDocumentsPage.navigateContinue(url, 12);

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.navigateContinue(url + '/submit');
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
