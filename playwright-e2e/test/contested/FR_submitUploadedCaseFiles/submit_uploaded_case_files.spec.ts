import {test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {ContestedEvents} from '../../../config/case-data';
import {getManageHearingTabData} from "../../../resources/tab_content/contested/manage-hearing_tabs.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

test.describe('Contested - Ready For Hearing', () => {
  test(
    'Form A case up to List for Hearing and Submit Uploaded Case Files',
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        submitUploadedCaseFilesPage,
      }
    ) => {
        
    const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Submit Uploaded Case Files 
    await caseDetailsPage.selectNextStep(ContestedEvents.submitUploadedCaseFiles);
    await submitUploadedCaseFilesPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.submitUploadedCaseFiles.listItem);
    await caseDetailsPage.assertTabData([getManageHearingTabData({
      typeOfHearing: "First Directions Appointment (FDA)",
      court: "Manchester County And Family Court",
      attendance: "In Person",
      hearingDate: DateHelper.getFormattedDateTwelveWeeksLater(),
      hearingTime: "10:00am",
      duration: "1hr 20mins",
      whoShouldSeeOrder: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
      additionalInformation: "This is additional information about the hearing",
      uploadFiles: ["HearingNotice.pdf", "Form-G.pdf", "PfdNcdrComplianceLetter.pdf", "PfdNcdrCoverLetter.pdf", "OutOfFamilyCourtResolution.pdf", "Form-C.pdf", "Dummy QA copy.doc"]
    })]);
  });
});
