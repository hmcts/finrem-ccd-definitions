import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums';
import { updateContactDetailsTabData } from '../../data/tab_content/consented/update_contact_details_caseworker_tabs';
import { ConsentedCaseDataHelper } from '../helpers/Consented/ConsentedCaseDataHelper';
import { consentedUpdateContactDetailsTableData } from '../../data/check_your_answer_content/update_contact_details/consentedUpdateContactDetailsTable';
import { updateRepresentedContactDetailsTabData } from '../../data/tab_content/consented/update_contact_details_represented';

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
      },
    ) => {
      // Create case and progress to HWF decision made
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToHWFDecision();

      const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
      const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
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
    'Consented - Update contact details - change in representation @test',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        updateContactDetailsPage,
        checkYourAnswersPage
      }) => {
      // Create case and progress to HWF decision made
      const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToHWFDecision();

      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Update contact details
      await caseDetailsPage.selectNextStep(ConsentedEvents.updateContactDetails);
      await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
      await updateContactDetailsPage.checkApplicantRepresented(true);
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.specifySolicitorName('Test Baggins'); 
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.specifyApplicantFirstName('Tester case');
      await updateContactDetailsPage.navigateContinue();

      //Continue about to submit and check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(consentedUpdateContactDetailsTableData);
      await updateContactDetailsPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.updateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateRepresentedContactDetailsTabData);
      }
);

