import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { createCaseTabData } from '../../../resources/tab_content/contested/solicitor_create_case_tabs';
import { expressCaseGateKeepingTabData } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';
import {
    contestedCreateExpressFormAMatrimonyCaseDetailsTable,
} from "../../../resources/check_your_answer_content/create_case/createCaseTable.ts";
import {ContestedEvents} from "../../../config/case-data.ts";

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
      checkYourAnswersPage,
      axeUtils
    },
    testInfo
  ) => {

    // Set up court information.
    const courtName: string = "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE";
    const courtAddress: string = "Priory Courts, 33 Bull Street, Birmingham, B4 6DS";
    const courtEmail: string = "FRCBirmingham@justice.gov.uk";
    const courtPhone: string = "0300 123 5577";
    const expectedURL: string = ContestedEvents.createCase.ccdCallback;

    // Sign in
    await manageCaseDashboardPage.visit()
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);

    // Manage/Create case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    await startPage.navigateContinue(expectedURL, 2);

    // Enter applicant details
    await solicitorDetailsPage.selectOrganisation(config.organisationNames.finRem1Org);
    await solicitorDetailsPage.enterSolicitorDetails('Bilbo Baggins', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.contested);
    await solicitorDetailsPage.navigateContinue(expectedURL, 3);

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsContested('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue(expectedURL, 4);

    //applicant details
    const keepPrivate: boolean = true;
    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
    await applicantDetailsPage.navigateContinue(expectedURL, 6);

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
    await respondentDetailsPage.checkRefugeFieldNotPresent();

    await respondentDetailsPage.navigateContinue(expectedURL, 7);

    await respondentRepresentedPage.selectRespondentRepresentedContested(true);
    await respondentRepresentedPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
    await respondentRepresentedPage.navigateContinue(expectedURL, 8);

    // Nature of App
    await natureOfApplicationPage.expressPilotSuitableNatureOfApplications();
    await natureOfApplicationPage.navigateContinue(expectedURL, 9);

    // Property Adjustment Order
    await propertyAdjustmentPage.propertyAdjustmentOrder();
    await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
    await propertyAdjustmentPage.navigateContinue(expectedURL, 10);

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
    await periodicalPaymentsPage.navigateContinue(expectedURL, 11);

    // Written Agreement
    await writtenAgreementPage.selectWrittenAgreement(false);
    await writtenAgreementPage.navigateContinue(expectedURL, 13);

    //Fast track procedure
    await fastTrackProcedurePage.selectFastTrack(false);
    await fastTrackProcedurePage.navigateContinue(expectedURL, 14);

    //Financial assets
    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue(expectedURL, 15);

    // Financial Remedies Court, a court is selected that is processing Express Case applications.
    await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await financialRemedyCourtPage.navigateContinue(expectedURL, 16);

    // Page shows to tell User that case is an Express Pilot
    await expressCaseEnrolledPage.checkLinkResolves();
    await axeUtils.audit({
      exclude: [
        'p:nth-child(2) > a[target="_blank"]'
      ]
    });
    await expressCaseEnrolledPage.navigateContinue(expectedURL, 17);

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue(expectedURL, 23);

    // Miam details
    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDoc();
    await miamDetailsPage.navigateContinue(expectedURL, 24);

    // Additional documents
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue(expectedURL, 25);

    // Saving your application. What happens next. If you need help.
    await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
    await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
    await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
    await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
      await uploadOrderDocumentsPage.navigateContinue(expectedURL + '/submit');

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedCreateExpressFormAMatrimonyCaseDetailsTable);

    // submits the case
    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

    // Assert case creation tab data
    await caseDetailsPage.assertTabData(createCaseTabData);

    // Assert express label set in tab data
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
  }
);
