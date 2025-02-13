import { test, expect } from '../../../fixtures/fixtures';
import { createCaseInCcd } from '../../../../test/helpers/utils';
import config from '../../../config/config';
import { RadioEnum } from '../../../pages/helpers/enums/RadioEnum';
import {createCaseTabData} from "../../../data/tab_content/contested/caseworker_create_case_tabs";

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
      caseDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Sign in
    await manageCaseDashboardPage.visit()
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);

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
    await solicitorDetailsPage.enterReferenceNumber('Y707HZM');
    await solicitorDetailsPage.enterUKaddress();
    await solicitorDetailsPage.selectApplicationType(RadioEnum.CHILDRENS_ACT);
    // await solicitorDetailsPage.navigateContinue();

    // Enter Divorce / Dissolution Details
    await divorceDetailsPage.enterDivorceDetailsContested('LV12D12345', config.divorceStage.petitionIssued);
    await divorceDetailsPage.navigateContinue();

    //applicant details
    const keepPrivate: boolean = true;
    const applicantInRefuge: RadioEnum = RadioEnum.YES;
    await applicantDetailsPage.enterApplicantDetailsContested('Frodo', 'Baggins', keepPrivate, applicantInRefuge);
    await applicantDetailsPage.navigateContinue();

    //respondent details
    await respondentDetailsPage.enterRespondentNames('Smeagol', 'Gollum');
    await respondentDetailsPage.navigateContinue();

    await respondentRepresentedPage.selectRespondentRepresentedContested(true);
    await respondentRepresentedPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await respondentRepresentedPage.enterSolicitorsDetails('Sauron', config.applicant_solicitor.email);
    await respondentRepresentedPage.selectRespondentInRefuge(true);
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
    await financialAssetsPage.selectAssetsValuePaperCase('Under £1 million');
    await financialAssetsPage.insertFamilyHomeValue('125,000');
    await financialAssetsPage.checkPotentialIssueNotApplicableCheckbox();
    await financialAssetsPage.navigateContinue();

    // Financial Remedies Court
    await financialRemedyCourtPage.selectCourtZoneDropDown();
    await financialRemedyCourtPage.selectHighCourtJudgeLevel(true);
    await financialRemedyCourtPage.enterSpecialFacilities();
    await financialRemedyCourtPage.enterSpecialArrangements();
    await financialRemedyCourtPage.selectShouldNotProceedApplicantHomeCourt(true);
    await financialRemedyCourtPage.enterHomeCourtReason();
    await financialRemedyCourtPage.navigateContinue();

    // Has attended miam
    await miamQuestionPage.selectHasAttendedMiam(true);
    await miamQuestionPage.navigateContinue();

    // Miam details
    await miamDetailsPage.enterMediatorRegistrationNumber();
    await miamDetailsPage.enterFamilyMediatorServiceName();
    await miamDetailsPage.enterSoleTraderName();
    await miamDetailsPage.uploadMiamDocPaperCase();
    await miamDetailsPage.navigateContinue();

    // Upload variation Order Document
    await uploadOrderDocumentsPage.uploadVariationOrderDoc();
    await uploadOrderDocumentsPage.selectUploadAdditionalDocs(false);
    await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(false);
    await uploadOrderDocumentsPage.navigateContinue();

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
