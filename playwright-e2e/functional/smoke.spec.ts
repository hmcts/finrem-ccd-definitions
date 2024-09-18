import { test, expect } from '../fixtures/fixtures.ts';
import config from '../config';

test(
  'Smoke Test - Contested FormA Submission',
  { tag: ['@smoke-test', '@accessibility'] },
  async (
    { loginPage, 
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
      caseDetailsPage,
      checkYourAnswersPage,
      makeAxeBuilder 
    },
    testInfo
  ) => {
    // Sign in
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);

    // Manage/Create case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(
      config.organisationNames.finRem1Org
    );
    await solicitorDetailsPage.enterSolicitorDetails('Test App Sol', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent()
    await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetails('LV12D12345', config.divorceStage.petitionIssued)
    await divorceDetailsPage.navigateContinue();

    //applicant details
    await applicantDetailsPage.enterApplicantDetails('App First Name', 'App Last Name', true);
    await applicantDetailsPage.navigateContinue();

    // //respondent details 
    await respondentDetailsPage.enterRespondentNames('Resp First Name', 'Resp Last Name' );
    await respondentDetailsPage.navigateContinue();

    await respondentRepresentedPage.selectRespondentRepresented(true)
    await respondentRepresentedPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await respondentRepresentedPage.enterSolicitorsDetails('Test Respondent', config.applicant_solicitor.email);
    await respondentRepresentedPage.navigateContinue();
    
    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await natureOfApplicationPage.navigateContinue();

    // Property Adjustment Order
    await propertyAdjustmentPage.propertyAdjustmentOrder();
    await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
    await propertyAdjustmentPage.navigateContinue();

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPayments(true);
    await periodicalPaymentsPage.navigateContinue();

    // Written Agreement
    await writtenAgreementPage.selectWrittenAgreement(false);
    await writtenAgreementPage.navigateContinue();

    //Fast track procedure
    await fastTrackProcedurePage.selectFastTrack(true);
    await fastTrackProcedurePage.navigateContinue();

    //Financial assets 
    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue();

    // Financial Remedies Court 
    await financialRemedyCourtPage.selectCourtZoneDropDown();
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await financialRemedyCourtPage.navigateContinue();

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue()

    // Miam details
    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDoc();
    await miamDetailsPage.navigateContinue();

    // Upload variation Order Document 
    await uploadOrderDocumentsPage.uploadVariationOrderDoc();
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue();
    
    //Continue about to submit and check your answers
    await checkYourAnswersPage.navigateContinue();
    await checkYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();
    
    // Note: Financial Assets page produces accessibility issues
    if(config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }
);
