import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { createCaseTabData } from '../../../resources/tab_content/contested/solicitor_create_case_tabs';
import { expressCaseGateKeepingTabData } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';

test(
  'Create Express Case - Contested FormA Submission, suitable for Express case processing',
  { tag: ['@accessibility'] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      createCasePage,
      startPage,
      solicitorDetailsPage,
      divorceDetailsPage,
      applicantDetailsPage,
      respondentDetailsPage,
      respondentRepresentedPage,
      natureOfApplicationPage,
      propertyAdjustmentPage,
      periodicalPaymentsPage,
      writtenAgreementPage,
      fastTrackProcedurePage,
      financialAssetsPage,
      financialRemedyCourtPage,
      miamQuestionPage,
      miamDetailsPage,
      uploadOrderDocumentsPage,
      createCaseCheckYourAnswersPage,
      caseDetailsPage,
      expressCaseEnrolledPage,
      createCaseSavingYourAnswersPage,
      makeAxeBuilder
    },
    testInfo
  ) => {

    // Set up court information.
    const courtName: string = "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE";
    const courtAddress: string = "Priory Courts, 33 Bull Street, Birmingham, B4 6DS";
    const courtEmail: string = "FRCBirmingham@justice.gov.uk";
    const courtPhone: string = "0300 123 5577";

    // Sign in
    await manageCaseDashboardPage.visit()
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

    // Manage/Create case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.contested);
    await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsContested('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue();

    //applicant details
    const keepPrivate: boolean = true;
    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
    await applicantDetailsPage.navigateContinue();

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
    await respondentDetailsPage.checkRefugeFieldNotPresent();

    await respondentDetailsPage.navigateContinue();

    await respondentRepresentedPage.selectRespondentRepresentedContested(true);
    await respondentRepresentedPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
    await respondentRepresentedPage.navigateContinue();

    // Nature of App
    await natureOfApplicationPage.expressPilotSuitableNatureOfApplications();
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

    //Fast track procedure
    await fastTrackProcedurePage.selectFastTrack(false);
    await fastTrackProcedurePage.navigateContinue();

    //Financial assets
    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue();

    // Financial Remedies Court, a court is selected that is processing Express Case applications.
    await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await financialRemedyCourtPage.navigateContinue();

    // Page shows to tell User that case is an Express Pilot
    await expressCaseEnrolledPage.checkLinkResolves();
    await expressCaseEnrolledPage.navigateContinue();

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue();

    // Miam details
    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDoc();
    await miamDetailsPage.navigateContinue();

    // Additional documents
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue();

    // Saving your application. What happens next. If you need help.
    await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
    await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
    await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
    await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
    await createCaseSavingYourAnswersPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);

    // submits the case
    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

    // Assert case creation tab data
    await caseDetailsPage.assertTabData(createCaseTabData);

    // Assert express label set in tab data
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);

    // Note: Financial Assets page produces accessibility issues
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
