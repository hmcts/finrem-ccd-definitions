import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../test/helpers/utils';
import { consentedEvents } from '../../config/case_events';
import { YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums';
import { updateContactDetailsTabData } from '../../data/tab_content/consented/update_contact_details_caseworker_tabs';

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
      const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json', 'FinancialRemedyMVP2', 'FR_solicitorCreate');
      const caseSubmission = await updateCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, caseId, 'FinancialRemedyMVP2', 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
      const hwfPaymentAccepted = await updateCaseInCcd(config.caseWorker.email, config.caseWorker.password, caseId, 'FinancialRemedyMVP2', 'FR_HWFDecisionMade', './playwright-e2e/data/case_data/consented/ccd-consented-case-creation.json');
      const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
      const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
      await manageCaseDashboardPage.navigateToCase(caseId);
  
      // Update contact details
      await caseDetailsPage.selectNextStep(consentedEvents.UpdateContactDetails);
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

      // await updateContactDetailsPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(consentedEvents.UpdateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateContactDetailsTabData);
    }
);
