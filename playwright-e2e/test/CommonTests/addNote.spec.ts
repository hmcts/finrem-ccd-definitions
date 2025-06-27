import {test} from "../../fixtures/fixtures.ts";
import config from "../../config/config.ts";
import {ConsentedCaseFactory} from "../../data-utils/factory/consented/ConsentedCaseFactory.ts";
import {ConsentedEvents, ContestedEvents} from "../../config/case-data.ts";
import {notesTabData} from "../../resources/tab_content/common-tabs/notes_tabs.ts";
import {DateHelper} from "../../data-utils/DateHelper.ts";
import {ContestedCaseFactory} from "../../data-utils/factory/contested/ContestedCaseFactory.ts";

const caseNotesTestData = [
        {
                title: 'Consented - Add Note - Assert validations',
                setupCase: () => ConsentedCaseFactory.createConsentedCaseUpToIssueApplication(),
                event: ConsentedEvents.addNotes,
        },
        {
                title: 'Contested - Add Note - Assert validations',
                setupCase: () => ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication(),
                event: ContestedEvents.addNotes,
        },
];

for (const data of caseNotesTestData) {
        test(
            data.title,
            {tag: []},
            async ({loginPage, manageCaseDashboardPage, caseDetailsPage, addNotePage, eventSummaryPage}) => {

                    // Create and setup case
                    await manageCaseDashboardPage.visit();
                    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);

                    const caseId = await data.setupCase();

                    // Navigate to case
                    await manageCaseDashboardPage.navigateToCase(caseId);
                    console.info(`Navigated to case with ID: ${caseId}`);

                    // Add note
                    await caseDetailsPage.selectNextStep(data.event);
                    await addNotePage.assertAddNotePage();
                    await addNotePage.assertNotesIsRequired();

                    // Assert error messages for mandatory fields
                    await addNotePage.assertErrorMessageForMandatoryFields();
                    for (let index = 0; index < 3; index++) {
                            await addNotePage.navigateAddNew();

                            // Enter mandatory fields
                            await addNotePage.enterAuthor(`Test Author ${index + 1}`, index);
                            await addNotePage.enterTodayDate(index);
                            await addNotePage.enterNote(`This is a test note ${index + 1}.`, index);
                    }

                    await addNotePage.removeContent(2)

                    await addNotePage.navigateContinue();

                    await eventSummaryPage.enterEventSummaryAndDescription("Test Event Summary", "Test Event Description");

                    await addNotePage.navigateSubmit();
                    await caseDetailsPage.checkHasBeenUpdated(data.event.listItem);
                    await caseDetailsPage.assertTabData(notesTabData(DateHelper.getTodayFormattedDate()))
            })
}
