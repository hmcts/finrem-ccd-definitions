import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { CommonEvents } from '../../config/case-data';
import { YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums';
import { updateContactDetailsTabData } from '../../resources/tab_content/consented/update_contact_details_caseworker_tabs';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import {
  consentedApplicantUpdateContactDetailsTableData,
  postSubmissionApplicantContactDetailsData
} from '../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable';
import { updateApplicantRepresentedContactDetailsTabData } from '../../resources/tab_content/consented/update_contact_details_represented';
import { updateContactDetailsRespondentNotRepresentedTable } from '../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable';
import {
  updateRespondentNonRepresentedContactDetailsSolChangeTabData,
  updateRespondentNonRepresentedContactDetailsTabData
} from '../../resources/tab_content/consented/update_contact_details_not_represented';
import { TestInfo } from 'playwright/test';

test(
  'Consented - Update contact details',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      createCaseCheckYourAnswersPage

    }
  ) => {
    // Create case and progress to HWF decision made
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToHWFDecision();

    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Update contact details
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.selectApplicantInRefuge(true);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.selectRespondentInRefuge(true);
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.checkRespondentInRefugeQuestion(respondentInRefuge);
    await createCaseCheckYourAnswersPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(updateContactDetailsTabData);
  }
);

test(
  'Consented - Update contact details - change in representation',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      checkYourAnswersPage,
      axeUtils
    }, testInfo) => {
    // Create case and progress to HWF decision made
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToHWFDecision();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Update contact details
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
    await updateContactDetailsPage.checkApplicantRepresented(true);
    await axeUtils.audit();
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.specifySolicitorName('Test Baggins'); 
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.specifyApplicantFirstName('Tester case');
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(consentedApplicantUpdateContactDetailsTableData);
    await updateContactDetailsPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(updateApplicantRepresentedContactDetailsTabData);

    // Update contact details and make respondent not represented
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
    await updateContactDetailsPage.checkRespondentRepresented(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.checkRepresentation(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.enterAddress('NW2 7NE');
    await updateContactDetailsPage.clickFindAddressButton();
    await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
    await updateContactDetailsPage.selectRespondentInRefuge(true);
    await axeUtils.audit();
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(updateContactDetailsRespondentNotRepresentedTable);
    await updateContactDetailsPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(updateRespondentNonRepresentedContactDetailsTabData);
  }
);

test(
  'Consented - Update contact details - applicant solicitor event',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      checkYourAnswersPage,
      axeUtils
    },
    testInfo: TestInfo
  ): Promise<void> => {

    const caseId: string = await test.step(
      'Create consented case up to issue application',
      async () => {
        return await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();
      }
    );

    await test.step('Login as applicant solicitor and open case', async (): Promise<void> => {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        config.applicant_solicitor.email,
        config.applicant_solicitor.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );

      await manageCaseDashboardPage.navigateToCase(caseId);
    });

    await test.step('Select "Update contact details" event', async (): Promise<void> => {
      await caseDetailsPage.selectNextStep(
        CommonEvents.updateContactDetailsSolicitor
      );
    });

    await test.step('Fill in contact details form', async (): Promise<void> => {
      await updateContactDetailsPage.specifySolicitorName('John Marston');
      await updateContactDetailsPage.enterAddress('NW2 7NE');
      await updateContactDetailsPage.clickFindAddressButton();
      await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
      await updateContactDetailsPage.navigateContinue();
    });

    await test.step('Verify check your answers page', async (): Promise<void> => {
      await checkYourAnswersPage.assertCheckYourAnswersPage(
        postSubmissionApplicantContactDetailsData
      );
    });

    await test.step('Submit update contact details event', async (): Promise<void> => {
      await updateContactDetailsPage.navigateSubmit();
    });

    await test.step('Verify case has been updated', async (): Promise<void> => {
      await caseDetailsPage.checkHasBeenUpdated(
        'has been updated with event: Update Contact Details'
      );
    });

    await test.step('Verify tab data', async (): Promise<void> => {
      await caseDetailsPage.assertTabData(
        updateRespondentNonRepresentedContactDetailsSolChangeTabData
      );
    });
  }
);
