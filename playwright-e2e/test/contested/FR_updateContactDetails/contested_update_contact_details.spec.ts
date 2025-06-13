import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import { ContestedEvents } from '../../../config/case-data.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import { contestedUpdateContactDetailsTableData } from "../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import {
    contestedUpdateContactDetailsTabData
} from "../../../resources/tab_content/contested/contested_update_contact_details_caseworker_tabs.ts";

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
        await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
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
