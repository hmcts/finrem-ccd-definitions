import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ApplicationtypeEnum, MaleOrFemaleEnum, YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { createCaseTabData } from '../../../resources/tab_content/contested/solicitor_create_case_tabs';
import { createCaseTabDataChildrensAct } from '../../../resources/tab_content/consented/create_case_tabs';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';


test(
  'Contested - Create Case FormA Matrimonial Submission by Solicitor',
  { tag: ['@accessibility','@chrome','@edge','@firefox','@webkit'] },
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
      createCaseSavingYourAnswersPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Set up court information.
    const courtName: string = "COVENTRY COMBINED COURT CENTRE";
    const courtAddress: string = "140 Much Park Street, Coventry, CV1 2SN";
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
    await respondentRepresentedPage.selectOrganisation(config.organisationNames.finRem2Org);
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
    await respondentRepresentedPage.navigateContinue();

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplication();
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
    await fastTrackProcedurePage.selectFastTrack(true);
    await fastTrackProcedurePage.navigateContinue();

    //Financial assets
    await financialAssetsPage.selectComplexityList('Yes');
    await financialAssetsPage.selectAssetsValue('Under £250,000');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue();

    // Financial Remedies Court, a court is selected that isn't currently processing Express Case applications.
    await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await financialRemedyCourtPage.navigateContinue();

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue();

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

    // Saving your application. What happens next. If you need help.
    await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
    await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
    await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
    await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
    await createCaseSavingYourAnswersPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);

    await createCaseCheckYourAnswersPage.navigateSubmit();

    await caseDetailsPage.checkHasBeenCreated();

    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);

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

test(
  'Contested - Caseworker view tabs post case creation',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage
    }
  ) => {
    // Create form A case
    const caseId = await ContestedCaseFactory.createAndProcessFormACase();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);
  }
);

test(
  'Contested - Create Case Form A Childrens Act Submission by Solicitor',
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
      createCaseSavingYourAnswersPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Set up court information.
    const courtName: string = "COVENTRY COMBINED COURT CENTRE";
    const courtAddress: string = "140 Much Park Street, Coventry, CV1 2SN";
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
    await solicitorDetailsPage.selectApplicationType(ApplicationtypeEnum.CHILDRENS_ACT); //Childrens Act case type
    await solicitorDetailsPage.navigateContinue();

    //applicant details
    const keepPrivate: boolean = true;
    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
    await applicantDetailsPage.navigateContinue();

    //Child(ren) details
    await childrensDetailsPage.addNewChild();
    await childrensDetailsPage.childLiveInEnglandOrWales(YesNoRadioEnum.YES);
    await childrensDetailsPage.enterChildFullName('Child A');
    await childrensDetailsPage.enterChildDateOfBirth('01', '01', '2010');
    await childrensDetailsPage.genderOfChild(MaleOrFemaleEnum.FEMALE);
    await childrensDetailsPage.relationshipOfApplicantToChild('Mother');
    await childrensDetailsPage.relationshipOfRespondentToChild('Father');
    await childrensDetailsPage.navigateContinue();

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
    await respondentDetailsPage.checkRefugeFieldNotPresent();
    await respondentDetailsPage.navigateContinue();

    // Respondent solicitor details
    await respondentRepresentedPage.selectRespondentRepresentedContested(true);
    await respondentRepresentedPage.selectOrganisation(config.organisationNames.finRem2Org);
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.respondent_solicitor.email);
    await respondentRepresentedPage.navigateContinue();

    // Nature of App
    await natureOfApplicationPage.selectNatureOfApplicationChildrens();
    await natureOfApplicationPage.navigateContinue();

    // Periodical Payments
    await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
    await periodicalPaymentsPage.navigateContinue();

    // Written Agreement
    await childWrittenAgreementPage.selectWrittenAgreement(YesNoRadioEnum.NO);
    await childWrittenAgreementPage.navigateContinue();

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
    await financialRemedyCourtPage.selectCourtZoneDropDown(courtName);
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterFrcReason();
    await financialRemedyCourtPage.navigateContinue();

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue();

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

    // Saving your application. What happens next. If you need help.
    await createCaseSavingYourAnswersPage.checkSelectedCourtAddress(courtAddress);
    await createCaseSavingYourAnswersPage.checkSelectedCourtName(courtName);
    await createCaseSavingYourAnswersPage.checkSelectedCourtPhone(courtPhone);
    await createCaseSavingYourAnswersPage.checkSelectedCourtEmail(courtEmail);
    await createCaseSavingYourAnswersPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenCreated();

    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabDataChildrensAct);

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
