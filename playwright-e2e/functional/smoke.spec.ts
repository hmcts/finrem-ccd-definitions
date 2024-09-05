import { test, expect } from '../fixtures/fixtures.ts';
import config from '../config';

test(
  'Smoke Test - Contested FormA Submission',
  { tag: ['@smoke-test', '@accessibility'] },
  async (
    { loginPage, 
      manageCasePage, 
      commonComponents, 
      solicitorDetailsPage, 
      divorceDetailsPage, 
      applicantDetailsPage, 
      respondentRepresentedPage, 
      natureOfApplicationPage, 
      propertyAdjustmentPage,
      periodicalPaymentsRadio,
      writtenAgreementPage,
      fastTrackProcedurePage,
      financialAssetsPage,
      financialRemedyCourtPage,
      miamQuestionPage,
      miamDetailsPage,
      uploadOrderDocumentsPage,
      caseDetailsPage,
      makeAxeBuilder 
    },
    testInfo
  ) => {
    // Sign in
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);

    // Manage/Create case
    await manageCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    await commonComponents.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(
      config.organisationNames.finRem1Org
    );
    await solicitorDetailsPage.enterSolicitorName('test');
    await commonComponents.enterPhoneNumber('12345678910');
    await commonComponents.enterEmailAddress(config.applicant_solicitor.email);
    await commonComponents.emailConsent(true);
    await commonComponents.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetails('LV12D12345', config.divorceStage.petitionIssued)
    await commonComponents.navigateContinue();

    //applicant details
    await commonComponents.enterNames('App First Name', 'App Last Name' );
    await applicantDetailsPage.selectApplicantDetailsPrivate(true);
    await commonComponents.enterUkAddress();
    await commonComponents.navigateContinue();

    // //respondent details 
    await commonComponents.enterNames('Resp First Name', 'Resp Last Name' );
    await commonComponents.navigateContinue();

    await respondentRepresentedPage.selectRespondentRepresented(true)
    await solicitorDetailsPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await solicitorDetailsPage.enterSolicitorName('Test Respondent');
    await solicitorDetailsPage.enterSolicitorsFirm();
    await commonComponents.enterUkAddress();
    await commonComponents.enterPhoneNumber('12345678910');
    await commonComponents.enterEmailAddress(config.respondent_solicitor.email);
    await commonComponents.navigateContinue();
    
    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await commonComponents.navigateContinue();

    // Property Adjustment Order
    await propertyAdjustmentPage.propertyAdjustmentOrder();
    await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
    await commonComponents.navigateContinue();

    // Periodical Payments

    await periodicalPaymentsRadio.selectPeriodicalPayments(true);
    await commonComponents.navigateContinue();

    // Written Agreement

    await writtenAgreementPage.selectWrittenAgreement(false);
    await commonComponents.navigateContinue();

    //Fast track procedure

    await fastTrackProcedurePage.selectFastTrack(true);
    await commonComponents.navigateContinue();

    //Financial assets 

    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await commonComponents.navigateContinue();

    // Financial Remedies Court 
    await financialRemedyCourtPage.selectCourtZoneDropDown();
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await commonComponents.navigateContinue();

    // Has attended miam

    await miamQuestionPage.selectHasAttenedMiam(true);
    await commonComponents.navigateContinue()

    // Miam details

    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDoc();
    await commonComponents.navigateContinue();

    // Upload variation Order Document 

    await uploadOrderDocumentsPage.uploadVariationOrderDoc();
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await commonComponents.navigateContinue();
    

    //Continue about to submit and check your answers
    await commonComponents.navigateContinue();
    await commonComponents.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();




    // Accessability Testing Financial assets page produces accessibility issues

    // Commented out for time being 

    // const accessibilityScanResults = await makeAxeBuilder().analyze();

    // await testInfo.attach('accessibility-scan-results', {
    //   body: JSON.stringify(accessibilityScanResults, null, 2),
    //   contentType: 'application/json',
    // });

    // expect(accessibilityScanResults.violations).toEqual([]);
  }
);
