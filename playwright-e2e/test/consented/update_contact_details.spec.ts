import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums';
import { updateContactDetailsTabData } from '../../resources/tab_content/consented/update_contact_details_caseworker_tabs';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import { consentedApplicantUpdateContactDetailsTableData } from '../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable';
import { updateApplicantRepresentedContactDetailsTabData } from '../../resources/tab_content/consented/update_contact_details_represented';
import { updateContactDetailsRespondentNotRepresentedTable } from '../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable';
import { updateRespondentNonRepresentedContactDetailsTabData  } from '../../resources/tab_content/consented/update_contact_details_not_represented';


test(
    'Consented - Update contact details',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        updateContactDetailsPage,
        createCaseCheckYourAnswersPage,

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
      await caseDetailsPage.selectNextStep(ConsentedEvents.updateContactDetails);
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
      await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.updateContactDetails.listItem);

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
      await caseDetailsPage.selectNextStep(ConsentedEvents.updateContactDetails);
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
      await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.updateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateApplicantRepresentedContactDetailsTabData);

      // Update contact details and make respondent not represented
      await caseDetailsPage.selectNextStep(ConsentedEvents.updateContactDetails);
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
      await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.updateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateRespondentNonRepresentedContactDetailsTabData);
    }
);
