import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import {getManageHearingTableData} from "../../../resources/check_your_answer_content/manage_hearings/manageHearingAddHearingTable.ts";
import { DateHelper } from '../../../data-utils/DateHelper.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';

const typeOfHearingData = [
    "Maintenance Pending Suit (MPS)",
    "First Directions Appointment (FDA)",
    "Financial Dispute Resolution (FDR)",
    "Final Hearing (FH)",
    "Directions (DIR)",
    "Mention",
    "Permission to Appeal",
    "Appeal Hearing (Financial Remedy)",
    "Application Hearing",
    "Retrial Hearing"
];

test.describe('Contested - Manage Hearings', () => {

    test(
        'Contested - Assert validations - Manage Hearings - Pre-Trial Review (PTR)', {
        tag: []},
        async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, checkYourAnswersPage}) => {

            // Create and setup case
            const date = await DateHelper.getCurrentDate();
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false, date);

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);
            console.info(`Navigated to case with ID: ${caseId}`);

            // Manage hearings
            await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
            await manageHearingPage.navigateContinue();
            await manageHearingPage.assertWhatWouldYouLikeToDoRequired();

            await manageHearingPage.selectAddANewHearing();
            await manageHearingPage.navigateContinue();

            await manageHearingPage.assertErrorMessagesForAllMandatoryFields();

            await manageHearingPage.uploadOtherDocuments("removeFile.pdf");
            await manageHearingPage.removeUploadedDocument();

            await manageHearingPage.enterHearingDate('asdf', 'asdf', 'asdf');
            await manageHearingPage.assertHearingDateFormatError()

            await manageHearingPage.addHearing({
                type: "Pre-Trial Review (PTR)",
                duration: '2 hours',
                date: {},
                time: '10:00 AM',
                court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
                attendance: 'Remote - video call',
                additionalInformation: 'Hearing details here',
                uploadAnySupportingDocuments: true,
                uploadFiles: ["final_hearing_file1.pdf", "final_hearing_file2.pdf"],
                sendANoticeOfHearing: true
            });

            await manageHearingPage.navigateContinue();
            await manageHearingPage.navigateIgnoreWarningAndContinue();
    
            const expectedTable = getManageHearingTableData({
                typeOfHearing: "Pre-Trial Review (PTR)"
            });
            await checkYourAnswersPage.assertCheckYourAnswersPage(expectedTable);

            await manageHearingPage.navigateSubmit();

            await caseDetailsPage.checkHasBeenUpdated('Manage Hearings');

    });

    for (const data of typeOfHearingData) {
        test(
            'Contested - Caseworker manages hearings for Form A case - ' + data,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, checkYourAnswersPage}) => {
                // Create and setup case
                const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

                // Login as caseworker and navigate to case
                await manageCaseDashboardPage.visit();
                await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
                await manageCaseDashboardPage.navigateToCase(caseId);
                console.info(`Navigated to case with ID: ${caseId}`);

                // Manage hearings
                await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
                await manageHearingPage.selectAddANewHearing();
                await manageHearingPage.navigateContinue();

                await manageHearingPage.addHearing({
                    type: data,
                    duration: '2 hours',
                    date: {},
                    time: '10:00 AM',
                    court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
                    attendance: 'Remote - video call',
                    additionalInformation: 'Hearing details here',
                    uploadAnySupportingDocuments: true,
                    uploadFiles: ["final_hearing_file1.pdf", "final_hearing_file2.pdf"],
                    sendANoticeOfHearing: true
                });

                await manageHearingPage.navigateContinue();
                await manageHearingPage.navigateIgnoreWarningAndContinue();

                const expectedTable = getManageHearingTableData({
                    typeOfHearing: data
                });
                await checkYourAnswersPage.assertCheckYourAnswersPage(expectedTable);

                await manageHearingPage.navigateSubmit();

                await caseDetailsPage.checkHasBeenUpdated('Manage Hearings');
            }
        )
    }

}
);
