import {test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { vacateHearingNotRelistedTableData } from '../../../resources/check_your_answer_content/manage_hearings/manageHearingVacateHearingTable.ts';

test.describe('Contested - Vacate Hearings - Not Relisted', () => {

    test('Contested - Vacate Hearing Option Available',
        { tag: [] }, async ({ loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, axeUtils, checkYourAnswersPage }) => {
            // Create and setup case up to issue application
            const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            //navigate to manage hearings event
            await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);

            //select hearing and vacate hearing
            await manageHearingPage.selectVacateHearing();
            await manageHearingPage.selectHearingToVacate(1); //selects first hearing
            await manageHearingPage.fillVacateHearingDate("12", "12", "2025");
            await manageHearingPage.whyIsTheHearingBeingVacated('Other - Please specify');
            await manageHearingPage.specifyOtherReasonForVacatingHearing('The hearing is no longer required');
            await manageHearingPage.navigateContinue();
            await axeUtils.audit();

            //will you be relisting question
            await manageHearingPage.willYouBeRelistingQuestion('no');
            await manageHearingPage.navigateContinue();

            //check your answers page
            await checkYourAnswersPage.assertCheckYourAnswersPage(vacateHearingNotRelistedTableData); 
            await manageHearingPage.navigateSubmit();

            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);
        });
});
