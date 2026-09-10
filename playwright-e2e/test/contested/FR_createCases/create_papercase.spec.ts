import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {YesNoRadioEnum, ApplicationtypeEnum, MaleOrFemaleEnum} from '../../../pages/helpers/enums/RadioEnums.ts';
import {
  createCaseTabData,
  createPaperCaseTabDataChildrensAct
} from '../../../resources/tab_content/contested/caseworker_create_case_tabs.ts';
import {
  contestedCreatePaperChildrenCaseDetailsTable, contestedCreatePaperMatrimonyCaseDetailsTable
} from '../../../resources/check_your_answer_content/create_case/createCaseTable.ts';
import {ContestedEvents} from '../../../config/case-data.ts';
import {envTestData} from '../../../data-utils/test_data/EnvTestDataConfig.ts';

// Create a test case for the Contested Paper Case
test(
  'Create Case - Contested Paper Case',
  { tag: ['@additionalTest'] },
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
      checkYourAnswersPage,
      caseDetailsPage
    },
    testInfo
  ) => {
    // Sign in
    await manageCaseDashboardPage.visit();
    await loginPage.loginCaseworker();
    const expectedURL: string = ContestedEvents.createPaperCase.ccdCallback;
    // Manage/Create case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.paperCase
    );

    await startPage.navigateContinue(expectedURL,1);

    // Select whether the applicant is represented or not. Then enter applicant details
    await solicitorDetailsPage.setApplicantRepresentation(true);
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.enterSolicitorsFirm('FinRem-1-Org');
    await solicitorDetailsPage.enterReferenceNumber(envTestData.ORG_ID_1);
    await solicitorDetailsPage.enterUKAddress({
      buildingAndStreet: envTestData.APP_SOL_BUILDING_STREET,
      addressLine2: 'Water Unite',
      townOrCity: envTestData.APP_SOL_TOWN_CITY,
      county: envTestData.APP_SOL_COUNTY,
      postcodeOrZipcode: envTestData.APP_SOL_POSTCODE
    });
    // Check both application types are present.
    await solicitorDetailsPage.selectApplicationType(ApplicationtypeEnum.CHILDRENS_ACT);
    await solicitorDetailsPage.selectApplicationType(ApplicationtypeEnum.MARRIAGE_CIVIL);
    await solicitorDetailsPage.navigateContinue(expectedURL,2);

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsContested('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue(expectedURL,3);

    //applicant details
    const keepPrivate: boolean = true;
    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
    await applicantDetailsPage.navigateContinue(expectedURL,5);

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
    await respondentDetailsPage.navigateContinue(expectedURL,6);

    await respondentRepresentedPage.selectRespondentRepresentedContested(true);
    await respondentRepresentedPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
    await respondentRepresentedPage.selectRespondentInRefuge(true);
    await respondentRepresentedPage.navigateContinue(expectedURL,7);

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
    await natureOfApplicationPage.navigateContinue(expectedURL,8);

    // Property Adjustment Order
    await propertyAdjustmentPage.propertyAdjustmentOrder();
    await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
    await propertyAdjustmentPage.navigateContinue(expectedURL,9);

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
    await periodicalPaymentsPage.navigateContinue(expectedURL,10);

    // Written Agreement
    await writtenAgreementPage.selectWrittenAgreement(false);
    await writtenAgreementPage.navigateContinue(expectedURL,12);

    //Fast track procedure
    await fastTrackProcedurePage.selectFastTrack(true);
    await fastTrackProcedurePage.navigateContinue(expectedURL,13);

    //Financial assets
    await financialAssetsPage.selectComplexityList('Yes');
    // start, check all the asset radio options are present
    await financialAssetsPage.selectAssetsValue('Over £20 million');
    await financialAssetsPage.selectAssetsValue('£10 million - £20 million');
    await financialAssetsPage.selectAssetsValue('£5 million - £10 million');
    await financialAssetsPage.selectAssetsValue('£1 million - £5 million');
    await financialAssetsPage.selectAssetsValue('£500,000 - £1 million');
    await financialAssetsPage.selectAssetsValue('Under £250,000 (this should be total of combined net assets, but excluding pensions)');
    await financialAssetsPage.selectAssetsValue('£250,000 - £500,000');
    // end, checked all the asset radio options are present
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue(expectedURL,14);

    // Financial Remedies Court
    await financialRemedyCourtPage.selectCourtZoneDropDown('Midlands', 'Birmingham FRC', 'COVENTRY COMBINED COURT CENTRE');
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterHomeCourtReason();
    await financialRemedyCourtPage.navigateContinue(expectedURL,16);

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue(expectedURL,22);

    // Miam details
    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDocPaperCase();
    await miamDetailsPage.navigateContinue(expectedURL,23);

    // Upload variation Order Document
    await uploadOrderDocumentsPage.uploadVariationOrderDoc();
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(true);
    await uploadOrderDocumentsPage.uploadOtherDocuments('test1.pdf', 'Other');
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue(expectedURL + '/submit');

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.checkNetAssetsQuestion('£250,000 - £500,000');
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreatePaperMatrimonyCaseDetailsTable);

    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);

  }
);

test(
  'Create Case - Contested Paper case Children Act Submission by Case Worker',
  { tag: ['@accessibility'] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      createCasePage,
      startPage,
      solicitorDetailsPage,
      applicantDetailsPage,
      childrensDetailsPage,
      respondentDetailsPage,
      respondentRepresentedPage,
      natureOfApplicationPage,
      periodicalPaymentsPage,
      childWrittenAgreementPage,
      fastTrackProcedurePage,
      financialAssetsPage,
      financialRemedyCourtPage,
      miamQuestionPage,
      miamDetailsPage,
      uploadOrderDocumentsPage,
      createCaseCheckYourAnswersPage,
      caseDetailsPage,
      checkYourAnswersPage
    }
  ) => {
    const expectedURL: string = ContestedEvents.createPaperCase.ccdCallback;

    await test.step('Sign in', async () => {
      await manageCaseDashboardPage.visit();
      await loginPage.loginCaseworker();
    });

    await test.step('Manage/Create case', async () => {
      await createCasePage.startCase(
        config.jurisdiction.familyDivorce,
        config.caseType.contested,
        config.eventType.paperCase
      );

      await startPage.navigateContinue();
    });

    await test.step('Select whether the applicant is represented or not. Then enter applicant details', async () => {
      await solicitorDetailsPage.setApplicantRepresentation(true);
      await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
      await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
      await solicitorDetailsPage.enterSolicitorsFirm('FinRem-1-Org');
      await solicitorDetailsPage.enterReferenceNumber(envTestData.ORG_ID_1);
      await solicitorDetailsPage.enterUKAddress({
        buildingAndStreet: envTestData.APP_SOL_BUILDING_STREET,
        addressLine2: 'Water Unite',
        townOrCity: envTestData.APP_SOL_TOWN_CITY,
        county: envTestData.APP_SOL_COUNTY,
        postcodeOrZipcode: envTestData.APP_SOL_POSTCODE
      });
      await solicitorDetailsPage.selectApplicationType(ApplicationtypeEnum.CHILDRENS_ACT);
      await solicitorDetailsPage.navigateContinue(expectedURL, 3);
    });

    await test.step('Applicant details', async () => {
      const keepPrivate: boolean = true;
      const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
      await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
      await applicantDetailsPage.navigateContinue(expectedURL, 4);
    });

    await test.step('Child(ren) details', async () => {
      await childrensDetailsPage.addNewChild();
      await childrensDetailsPage.childLiveInEnglandOrWales(YesNoRadioEnum.YES);
      await childrensDetailsPage.enterChildFullName('Child A');
      await childrensDetailsPage.enterChildDateOfBirth('01', '01', '2010');
      await childrensDetailsPage.genderOfChild(MaleOrFemaleEnum.FEMALE);
      await childrensDetailsPage.relationshipOfApplicantToChild('Mother');
      await childrensDetailsPage.relationshipOfRespondentToChild('Father');
      await childrensDetailsPage.navigateContinue(expectedURL, 5);
    });

    await test.step('Respondent details', async () => {
      await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
      await respondentDetailsPage.checkRefugeFieldNotPresent();
      await respondentDetailsPage.navigateContinue(expectedURL, 6);
    });

    await test.step('Respondent solicitor details', async () => {
      await respondentRepresentedPage.selectRespondentRepresentedContested(true);
      await respondentRepresentedPage.selectOrganisation(config.organisationNames.finRem2Org);
      await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
      await respondentRepresentedPage.navigateContinue(expectedURL, 7);
    });

    await test.step('Nature of App', async () => {
      await natureOfApplicationPage.selectNatureOfApplicationChildrens();
      await natureOfApplicationPage.navigateContinue(expectedURL, 9);
    });

    await test.step('Periodical Payments', async () => {
      await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
      await periodicalPaymentsPage.navigateContinue(expectedURL, 11);
    });

    await test.step('Written Agreement', async () => {
      await childWrittenAgreementPage.selectWrittenAgreement(YesNoRadioEnum.NO);
      await childWrittenAgreementPage.navigateContinue(expectedURL, 12);
    });

    await test.step('Fast track procedure', async () => {
      await fastTrackProcedurePage.selectFastTrack(true);
      await fastTrackProcedurePage.navigateContinue(expectedURL, 13);
    });

    await test.step('Financial assets', async () => {
      await financialAssetsPage.selectComplexityList('Yes');
      await financialAssetsPage.selectAssetsValue('Under £250,000');
      await financialAssetsPage.insertFamilyHomeValue('125,000');
      await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
      await financialAssetsPage.navigateContinue(expectedURL, 14);
    });

    await test.step('Financial Remedies Court', async () => {
      await financialRemedyCourtPage.selectCourtZoneDropDown('Midlands', 'Birmingham FRC', 'COVENTRY COMBINED COURT CENTRE');
      await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
      await financialRemedyCourtPage.enterSpecialFacilities();
      await financialRemedyCourtPage.enterSpecialArrangements();
      await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
      await financialRemedyCourtPage.enterHomeCourtReason();
      await financialRemedyCourtPage.navigateContinue(expectedURL, 16);
    });

    await test.step('Has attended miam', async () => {
      await miamQuestionPage.selectHasAttendedMiam(true);
      await miamQuestionPage.navigateContinue(expectedURL, 22);
    });

    await test.step('Miam details', async () => {
      await miamDetailsPage.enterMediatorRegistrationNumber();
      await miamDetailsPage.enterFamilyMediatorServiceName();
      await miamDetailsPage.enterSoleTraderName();
      await miamDetailsPage.uploadMiamDocPaperCase();
      await miamDetailsPage.navigateContinue(expectedURL, 23);
    });

    await test.step('Upload variation Order Document', async () => {
      await uploadOrderDocumentsPage.selectUploadAdditionalDocs(true);
      await uploadOrderDocumentsPage.uploadOtherDocuments('test1.pdf', 'Other');
      await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
      await uploadOrderDocumentsPage.uploadVariationOrderDoc();
      await uploadOrderDocumentsPage.navigateContinue();
    });

    await test.step('Continue about to submit and check your answers', async () => {
      await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreatePaperChildrenCaseDetailsTable);
      await createCaseCheckYourAnswersPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenCreated();
    });

    await test.step('Assert tab data', async () => {
      await caseDetailsPage.assertTabData(createPaperCaseTabDataChildrensAct);
    });
  }
);
