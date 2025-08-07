import { test, expect } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseTabData } from '../../resources/tab_content/consented/create_case_tabs';
import {ConsentedEvents} from "../../config/case-data.ts";

test(
  'Consented - Create Case',
  { tag: ['@accessibility','@edge'] },
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
      axeUtils
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
    await axeUtils.audit();
    await solicitorDetailsPage.navigateContinue(url, 3);

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsConsented('LV12D12345', config.divorceStage.petitionIssued);
    await axeUtils.audit();
    await divorceDetailsPage.navigateContinue(url, 4);

    //applicant details
    await applicantDetailsPage.enterApplicantDetailsConsented('Frodo', 'Baggins');
    await financialRemedyCourtPage.selectCourtZoneDropDown('COVENTRY COMBINED COURT CENTRE');
    await axeUtils.audit();
    await applicantDetailsPage.navigateContinue(url, 5);

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Gollum', 'Smeagol');
    await respondentRepresentedPage.selectRespondentRepresentedConsented(false);
    await respondentDetailsPage.enterRespondentAddress();
    await axeUtils.audit();
    await respondentDetailsPage.navigateContinue(url, 6);

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await natureOfApplicationPage.addConsentedPropertyAdjustmentDetails();
    await axeUtils.audit();
    await natureOfApplicationPage.navigateContinue(url, 7);

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsConsented(false);
    await axeUtils.audit();
    await periodicalPaymentsPage.navigateContinue(url, 8);

    // Upload variation Order Document
    await uploadOrderDocumentsPage.uploadConsentOrder();
    await uploadOrderDocumentsPage.navigateContinue();
    await uploadOrderDocumentsPage.selectAndUploadJointD81(true);
    await axeUtils.audit();

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
    await axeUtils.audit();
    await axeUtils.finalizeReport(testInfo);
  }
);
