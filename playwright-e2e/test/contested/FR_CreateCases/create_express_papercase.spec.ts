import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { YesNoRadioEnum, ApplicationtypeEnum } from '../../../pages/helpers/enums/RadioEnums';
import {createCaseTabData} from '../../../resources/tab_content/contested/caseworker_create_case_tabs';
import { expressCaseGateKeepingTabData, expressCaseGateKeeping250TabData } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';
import {
    contestedCreateExpressPaperMatrimonyCaseDetailsTable,
} from "../../../resources/check_your_answer_content/create_case/createCaseTable.ts";
import {ContestedEvents} from "../../../config/case-data.ts";

// Create a test case for the Contested Paper Case
test(
  'Create Case - Contested Paper Case',
  { tag: ['@additionalTest', '@nightly-dev'] },
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
      expressCaseEnrolledPage,
      miamQuestionPage,
      miamDetailsPage,
      uploadOrderDocumentsPage,
      createCaseCheckYourAnswersPage,
      checkYourAnswersPage,
      caseDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    
    // Set up court information.
    const courtName: string = "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE";
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

    await startPage.navigateContinue(expectedURL,1);

    // Select whether the applicant is represented or not. Then enter applicant details
    await solicitorDetailsPage.setApplicantRepresentation(true);
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.enterSolicitorsFirm('FinRem-1-Org');
    await solicitorDetailsPage.enterReferenceNumber('Y707HZM');
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
    await natureOfApplicationPage.expressPilotSuitableNatureOfApplications();
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
    await fastTrackProcedurePage.selectFastTrack(false);
    await fastTrackProcedurePage.navigateContinue(expectedURL,13);

    //Financial assets
    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue(expectedURL,14);

    // Financial Remedies Court, a court is selected that is processing Express Case applications.
    await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterHomeCourtReason();
    await financialRemedyCourtPage.navigateContinue(expectedURL,15);

    // Page shows to tell User that case is an Express Pilot
    await expressCaseEnrolledPage.checkLinkResolves();
    await expressCaseEnrolledPage.navigateContinue(expectedURL,16);

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
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue(expectedURL + '/submit');

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.checkNetAssetsQuestion('Under £250,000 (this should be total of combined net assets, but excluding pensions)');
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreateExpressPaperMatrimonyCaseDetailsTable)
    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);
    // Assert express label set in tab data
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
    await caseDetailsPage.assertTabData(expressCaseGateKeeping250TabData);

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
