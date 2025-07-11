import {caseAssignmentApi, test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedEvents} from "../../../config/case-data.ts";
import {
    getManageHearingTableData
} from "../../../resources/check_your_answer_content/manage_hearings/manageHearingAddHearingTable.ts";
import {DateHelper} from '../../../data-utils/DateHelper.ts';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import {ContestedEventApi} from '../../../data-utils/api/contested/ContestedEventApi.ts';
import {CaseTypeEnum} from "../../../pages/helpers/enums/RadioEnums.ts";
import {SigninPage} from "../../../pages/SigninPage.ts";
import {ManageCaseDashboardPage} from "../../../pages/ManageCaseDashboardPage.ts";
import {CaseDetailsPage} from "../../../pages/CaseDetailsPage.ts";
import {getManageHearingTabData} from "../../../resources/tab_content/contested/manage-hearing_tabs.ts";

const typeOfHearingData = [
    {
        typeOfHearing: "Maintenance Pending Suit (MPS)",
        hearingDocuments: ["HearingNotice.pdf", "final_hearing_file1.pdf", "final_hearing_file2.pdf"]
    },
    {
        typeOfHearing: "First Directions Appointment (FDA)",
        hearingDocuments: ["HearingNotice.pdf", "Form-G.pdf", "PfdNcdrComplianceLetter.pdf", "PfdNcdrCoverLetter.pdf", "OutOfFamilyCourtResolution.pdf", "Form-C.pdf", "final_hearing_file1.pdf", "final_hearing_file2.pdf"]
    },
    {
        typeOfHearing: "Financial Dispute Resolution (FDR)",
        hearingDocuments: ["HearingNotice.pdf", "final_hearing_file1.pdf", "final_hearing_file2.pdf"]
    }
];

async function verifyDifferentActorsForCFV(
        manageCaseDashboardPage: ManageCaseDashboardPage,
        loginPage: SigninPage,
        caseId: string,
        caseDetailsPage: CaseDetailsPage,
        userCred: { email: string, password: string } = config.applicant_solicitor
    ) {
    if (!process.env.CI) {
        console.log(`Verifying CFV access for user: ${userCred.email}`);
    }
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(userCred.email, userCred.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.assertTabData([getManageHearingTabData()]);
    await caseDetailsPage.validateFileTree([
        {
            type: 'folder',
            label: 'Hearing Notices',
            children: [
                {
                    type: 'file',
                    label: 'HearingNotice.pdf',
                    contentSnippets: [
                        'Notice of Hearing',
                        `Case number: ${caseId}`,
                        'of Frodo Baggins and Smeagol Gollum',
                        'The case is listed for a FDR hearing:',
                        'with hearing attendance: In Person',
                        'at 10:00 AM',
                        'the probable length of hearing is 2 hours',
                        DateHelper.formatToDayMonthYear(await DateHelper.getHearingDateUsingCurrentDate()),
                        `Dated: ${DateHelper.formatToDayMonthYear(DateHelper.getCurrentDate())}`,
                    ]
                }
            ]
        }
    ]);
    await manageCaseDashboardPage.signOut();
    if (!process.env.CI) {
        console.log(`VERIFIED CFV access for user: ${userCred.email}`);
    }
}

test.describe('Contested - Manage Hearings', () => {

    test(
        'Contested - Assert validations - Manage Hearings - Pre-Trial Review (PTR)', {
        tag: []},
        async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, checkYourAnswersPage}) => {

            // Create and setup case
            const date = DateHelper.getCurrentDate();
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(false, date);

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
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
            await manageHearingPage.removeContent();

            await manageHearingPage.enterHearingDate('asdf', 'asdf', 'asdf');
            await manageHearingPage.assertHearingDateFormatError()

            const hearingList = [
                "Maintenance Pending Suit (MPS)",
                "First Directions Appointment (FDA)",
                "Financial Dispute Resolution (FDR)",
                "Final Hearing (FH)",
                "Directions (DIR)",
                "Mention",
                "Permission to Appeal",
                "Appeal Hearing (Financial Remedy)",
                "Application Hearing",
                "Retrial Hearing",
                "Pre-Trial Review (PTR)"
            ];

            await manageHearingPage.assertHearingTypeDropDownOptionsAreVisible(hearingList);

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

            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);
            await caseDetailsPage.assertTabData([getManageHearingTabData({
                typeOfHearing: "Pre-Trial Review (PTR)",
                court: "Central Family Court",
                attendance: "Remote - Video call",
                hearingTime: "10:00 AM",
                duration: "2 hours",
                whoShouldSeeOrder: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
                additionalInformation: "Hearing details here",
                uploadFiles: ["HearingNotice.pdf", "final_hearing_file1.pdf", "final_hearing_file2.pdf"]
            })]);

    });

    for (const data of typeOfHearingData) {
        test(
            'Contested - Caseworker adds hearings for Form A case - ' + data.typeOfHearing,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, checkYourAnswersPage}) => {
                // Create and setup case
                const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

                // Login as caseworker and navigate to case
                await manageCaseDashboardPage.visit();
                await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
                await manageCaseDashboardPage.navigateToCase(caseId);
                console.info(`Navigated to case with ID: ${caseId}`);

                // Manage hearings
                await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
                await manageHearingPage.selectAddANewHearing();
                await manageHearingPage.navigateContinue();

                await manageHearingPage.addHearing({
                    type: data.typeOfHearing,
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
                    typeOfHearing: data.typeOfHearing
                });
                await checkYourAnswersPage.assertCheckYourAnswersPage(expectedTable);

                await manageHearingPage.navigateSubmit();

                await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);
                await caseDetailsPage.assertTabData([getManageHearingTabData({
                    typeOfHearing: data.typeOfHearing,
                    court: "Central Family Court",
                    attendance: "Remote - Video call",
                    hearingTime: "10:00 AM",
                    duration: "2 hours",
                    whoShouldSeeOrder: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
                    additionalInformation: "Hearing details here",
                    uploadFiles: data.hearingDocuments
                })]);
            }
        )
    }

    test(
        'Contested - Manage Hearings - Add Hearing and verify access to CFV', {tag: []},
        async ({loginPage, manageCaseDashboardPage, caseDetailsPage, manageHearingPage, checkYourAnswersPage}) => { 

            // Create and setup case
            const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
            await ContestedEventApi.caseworkerAddsApplicantIntervener(caseId);
            await ContestedEventApi.caseworkerAddsRespondentIntervener(caseId);
            await ContestedEventApi.caseworkerAddsApplicantBarrister(caseId);
            await ContestedEventApi.caseworkerAddsRespondentBarrister(caseId);
            await caseAssignmentApi.assignCaseToRespondent(caseId, CaseTypeEnum.CONTESTED);

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);
            console.info(`Navigated to case with ID: ${caseId}`);

            // Manage hearings
            await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
            await manageHearingPage.selectAddANewHearing();
            await manageHearingPage.navigateContinue(); 
            await manageHearingPage.addHearing({
                type: "Financial Dispute Resolution (FDR)",
                duration: '2 hours',
                date: {},
                time: '10:00 AM',
                court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
                attendance: 'In person',
                additionalInformation: 'Hearing details here',
                uploadAnySupportingDocuments: true,
                uploadFiles: ["final_hearing_file1.pdf", "final_hearing_file2.pdf"],
                sendANoticeOfHearing: true                
            });
            
            //Who should see this order - all parties
             await manageHearingPage.selectAllWhoShouldSeeThisOrder([
                { partyType: 'Applicant', partyName: 'Frodo Baggins' },
                { partyType: 'Respondent', partyName: 'Smeagol Gollum' },
                { partyType: 'Intervener1', partyName: 'IntApp1' },
                { partyType: 'Intervener2', partyName: 'IntResp1' }
            ]);

            await manageHearingPage.navigateContinue();
            await manageHearingPage.navigateIgnoreWarningAndContinue();
            const expectedTable = getManageHearingTableData({
                typeOfHearing: "Financial Dispute Resolution (FDR)",
                attendance: 'In person',
                whoShouldSeeOrder: 'Applicant - Frodo Baggins\nRespondent - Smeagol Gollum\nIntervener1 - intApp1\nIntervener2 - intResp1'
            });
            await checkYourAnswersPage.assertCheckYourAnswersPage(expectedTable);
            await manageHearingPage.navigateSubmit();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageHearings.listItem);
            await caseDetailsPage.assertTabData([getManageHearingTabData()]);
            await caseDetailsPage.validateFileTree([
                {
                    type: 'folder',
                    label: 'Hearing Notices',
                    children: [
                        {
                            type: 'file',
                            label: 'HearingNotice.pdf',
                            contentSnippets: [
                                'Notice of Hearing',
                                `Case number: ${caseId}`,
                                'of Frodo Baggins and Smeagol Gollum',
                                'The case is listed for a FDR hearing:',
                                'with hearing attendance: In Person',
                                'at 10:00 AM',
                                'the probable length of hearing is 2 hours',
                                DateHelper.formatToDayMonthYear(await DateHelper.getHearingDateUsingCurrentDate()),
                                `Dated: ${DateHelper.formatToDayMonthYear(DateHelper.getCurrentDate())}`,
                            ]
                        }
                    ]
                }
            ]);

            await manageCaseDashboardPage.signOut();

            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.applicant_solicitor);
            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.applicant_intervener);
            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.respondent_solicitor);
            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.respondent_intervener);
            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.applicant_barrister);
            await verifyDifferentActorsForCFV(manageCaseDashboardPage, loginPage, caseId, caseDetailsPage, config.respondent_barrister);

        }
    );
});
