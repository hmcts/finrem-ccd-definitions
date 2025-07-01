import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import { ContestedEvents } from '../../../config/case-data.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import { contestedUpdateContactDetailsTableData } from "../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import { updateContestedApplicantRepresentedContactDetailsTabData } from "../../../resources/tab_content/contested/update_contact_details_represented.ts";
import { contestedUpdateContactDetailsTabData } from "../../../resources/tab_content/contested/contested_update_contact_details_caseworker_tabs.ts";
import { contestedApplicantUpdateContactDetailsTableData } from '../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts';
import { contestedUpdateContactDetailsRespondentNotRepresentedTable } from "../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts";
import { updateContestedRespondentNonRepresentedContactDetailsTabData  } from "../../../resources/tab_content/contested/update_contact_details_not_represented.ts";

test(
    'Contested - Update Contact Details as a caseworker',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        updateContactDetailsPage,
        createCaseCheckYourAnswersPage,
        checkYourAnswersPage
      }) => {
        
        // Create case and progress to HWF decision made
        const caseId = await ContestedCaseFactory.createContestedCaseUpToHWFDecision();

        const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
        const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

        // Login as caseworker and create case
        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
        await manageCaseDashboardPage.navigateToCase(caseId);

        // Update contact details
        await caseDetailsPage.selectNextStep(ContestedEvents.updateContactDetails);
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
        await checkYourAnswersPage.assertCheckYourAnswersPage(contestedUpdateContactDetailsTableData);

        await createCaseCheckYourAnswersPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.updateContactDetails.listItem);

        // Assert tab data
        await caseDetailsPage.assertTabData(contestedUpdateContactDetailsTabData);
    }
);

test(
    'Contested - Update contact details - change in representation',
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
      const caseId = await ContestedCaseFactory.createContestedCaseUpToHWFDecision();

      // Login as caseworker
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Update contact details
      await caseDetailsPage.selectNextStep(ContestedEvents.updateContactDetails);
      await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
      await updateContactDetailsPage.checkApplicantRepresented(true);
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.specifyContestedSolicitorName('Test Baggins'); 
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.specifyApplicantFirstName('Tester case');
      await updateContactDetailsPage.navigateContinue();

      //Continue about to submit and check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(contestedApplicantUpdateContactDetailsTableData);
      await updateContactDetailsPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.updateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateContestedApplicantRepresentedContactDetailsTabData);

      // Update contact details and make respondent not represented
      await caseDetailsPage.selectNextStep(ContestedEvents.updateContactDetails);
      await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
      await updateContactDetailsPage.checkRespondentRepresented(false);
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.checkRepresentation(false);
      await updateContactDetailsPage.navigateContinue();
      await updateContactDetailsPage.enterAddress('NW2 7NE');
      await updateContactDetailsPage.clickFindAddressButton();
      await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
      await updateContactDetailsPage.selectRespondentInRefuge(true);
      await updateContactDetailsPage.navigateContinue();

      //Continue about to submit and check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(contestedUpdateContactDetailsRespondentNotRepresentedTable); 
      await updateContactDetailsPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.updateContactDetails.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(updateContestedRespondentNonRepresentedContactDetailsTabData);
    }
);
