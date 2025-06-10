import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { contestedUpdateContactDetailsTabData } from '../../../data/tab_content/contested/contested_update_contact_details_caseworker_tabs';
import { ContestedCaseDataHelper } from '../../helpers/Contested/ContestedCaseDataHelper';
import { contestedUpdateContactDetailsTableData } from "../../../data/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts";

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
        const caseId = await ContestedCaseDataHelper.createContestedCaseUpToHWFDecision();

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
