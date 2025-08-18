import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {YesNoRadioEnum, ApplicationtypeEnum, MaleOrFemaleEnum} from '../../../pages/helpers/enums/RadioEnums';
import {
    createCaseTabData,
    createPaperCaseTabDataChildrensAct
} from '../../../resources/tab_content/contested/caseworker_create_case_tabs';
import {createCaseTabDataChildrensAct} from "../../../resources/tab_content/consented/create_case_tabs.ts";
import {
    contestedCreatePaperChildrenCaseDetailsTable, contestedCreatePaperMatrimonyCaseDetailsTable
} from "../../../resources/check_your_answer_content/create_case/createCaseTable.ts";
import {ContestedEvents} from "../../../config/case-data.ts";
import {envTestData} from "../../../data-utils/test_data/EnvTestDataConfig.ts";

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
    await manageCaseDashboardPage.visit()
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
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
          buildingAndStreet: "3rd Floor, 65-68 Leadenhall St",
          addressLine2: "Water Unite",
          townOrCity: "London",
          county: "Greater London",
          postcodeOrZipcode: "EC3A 2AD",
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
    await financialAssetsPage.selectAssetsValue('Over £15 million');
    await financialAssetsPage.selectAssetsValue('£7.5 - £15 million');
    await financialAssetsPage.selectAssetsValue('£1 - £7.5 million');
    await financialAssetsPage.selectAssetsValue('Under £1 million');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.selectAssetsValue('Unable to quantify');
    // end, checked all the asset radio options are present
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue(expectedURL,14);

    // Financial Remedies Court
    await financialRemedyCourtPage.selectCourtZoneDropDown("COVENTRY COMBINED COURT CENTRE");
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
    await uploadOrderDocumentsPage.uploadOtherDocuments("test1.pdf", "Other");
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue(expectedURL + '/submit');

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.checkNetAssetsQuestion('Unable to quantify');
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreatePaperMatrimonyCaseDetailsTable)

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
            checkYourAnswersPage,
        }
    ) => {
        // Set up court information.
        const courtName: string = "COVENTRY COMBINED COURT CENTRE";
        const expectedURL: string = ContestedEvents.createPaperCase.ccdCallback;

        // Sign in
        await manageCaseDashboardPage.visit()
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);

        // Manage/Create case
        await createCasePage.startCase(
            config.jurisdiction.familyDivorce,
            config.caseType.contested,
            config.eventType.paperCase
        );

        await startPage.navigateContinue();

        // Select whether the applicant is represented or not. Then enter applicant details
        await solicitorDetailsPage.setApplicantRepresentation(true);
        await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
        await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
        await solicitorDetailsPage.enterSolicitorsFirm('FinRem-1-Org');
        await solicitorDetailsPage.enterReferenceNumber(envTestData.ORG_ID_1);
        await solicitorDetailsPage.enterUKAddress({
            buildingAndStreet: "3rd Floor, 65-68 Leadenhall St",
            addressLine2: "Water Unite",
            townOrCity: "London",
            county: "Greater London",
            postcodeOrZipcode: "EC3A 2AD",
        });
        await solicitorDetailsPage.selectApplicationType(ApplicationtypeEnum.CHILDRENS_ACT); //Childrens Act case type
        await solicitorDetailsPage.navigateContinue(expectedURL,3);

        //applicant details
        const keepPrivate: boolean = true;
        const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
        await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
        await applicantDetailsPage.navigateContinue(expectedURL, 4);

        //Child(ren) details
        await childrensDetailsPage.addNewChild();
        await childrensDetailsPage.childLiveInEnglandOrWales(YesNoRadioEnum.YES);
        await childrensDetailsPage.enterChildFullName('Child A');
        await childrensDetailsPage.enterChildDateOfBirth('01', '01', '2010');
        await childrensDetailsPage.genderOfChild(MaleOrFemaleEnum.FEMALE);
        await childrensDetailsPage.relationshipOfApplicantToChild('Mother');
        await childrensDetailsPage.relationshipOfRespondentToChild('Father');
        await childrensDetailsPage.navigateContinue(expectedURL, 5);

        //respondent details
        await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
        await respondentDetailsPage.checkRefugeFieldNotPresent();
        await respondentDetailsPage.navigateContinue(expectedURL, 6);

        // Respondent solicitor details
        await respondentRepresentedPage.selectRespondentRepresentedContested(true);
        await respondentRepresentedPage.selectOrganisation(config.organisationNames.finRem2Org);
        await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
        await respondentRepresentedPage.navigateContinue(expectedURL, 7);

        // Nature of App
        await natureOfApplicationPage.selectNatureOfApplicationChildrens();
        await natureOfApplicationPage.navigateContinue(expectedURL, 9);

        // Periodical Payments
        await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
        await periodicalPaymentsPage.navigateContinue(expectedURL, 11);

        // Written Agreement
        await childWrittenAgreementPage.selectWrittenAgreement(YesNoRadioEnum.NO);
        await childWrittenAgreementPage.navigateContinue(expectedURL, 12);

        //Fast track procedure
        await fastTrackProcedurePage.selectFastTrack(true);
        await fastTrackProcedurePage.navigateContinue(expectedURL, 13);

        //Financial assets
        await financialAssetsPage.selectComplexityList('Yes');
        await financialAssetsPage.selectAssetsValue('Under £250,000');
        await financialAssetsPage.insertFamilyHomeValue('125,000');
        await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
        await financialAssetsPage.navigateContinue(expectedURL, 14);

        // Financial Remedies Court
        await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
        await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
        await financialRemedyCourtPage.enterSpecialFacilities();
        await financialRemedyCourtPage.enterSpecialArrangements();
        await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
        await financialRemedyCourtPage.enterHomeCourtReason();
        await financialRemedyCourtPage.navigateContinue(expectedURL, 16);

        // Has attended miam
        await miamQuestionPage.selectHasAttendedMiam(true);
        await miamQuestionPage.navigateContinue(expectedURL, 22);

        // Miam details
        await miamDetailsPage.enterMediatorRegistrationNumber();
        await miamDetailsPage.enterFamilyMediatorServiceName();
        await miamDetailsPage.enterSoleTraderName();
        await miamDetailsPage.uploadMiamDocPaperCase();
        await miamDetailsPage.navigateContinue(expectedURL, 23);

        // Upload variation Order Document
        await uploadOrderDocumentsPage.selectUploadAdditionalDocs(true);
        await uploadOrderDocumentsPage.uploadOtherDocuments("test1.pdf", "Other");
        await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
        await uploadOrderDocumentsPage.uploadVariationOrderDoc();
        await uploadOrderDocumentsPage.navigateContinue();

        //Continue about to submit and check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreatePaperChildrenCaseDetailsTable)
        await createCaseCheckYourAnswersPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenCreated();

        // Assert tab data
        await caseDetailsPage.assertTabData(createPaperCaseTabDataChildrensAct);
    }
);
