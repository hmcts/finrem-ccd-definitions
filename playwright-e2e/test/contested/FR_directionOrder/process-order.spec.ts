import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { generateHearingsTabData, processOrderHearingTabData } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { unprocessedApprovedOrdersWithNewHearingTable, unprocessedApprovedOrdersWithOldHearingTable } from '../../../resources/check_your_answer_content/FR_directionOrder/proessOrderTable.ts';
import { processOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs.ts';
import { createDraftOrdersApprovedWithHearingTabData } from '../../../resources/tab_content/contested/draft_orders_tabs.ts';
import { DateHelper } from '../../../data-utils/DateHelper.ts';

/**
 * Firstly, performs the upload draft order flow as a step towards the Process Order event.
 *
 * This could be done via API call, when work done for Playwright to directly upload files
 * to Document Management API.  The current service token authenticates, but isn't authorised.
 *
 * Secondly, uses PayloadHelper to approve the order as a judge.
 *
 * Finally, returns an object with information needed to process an order with an API call.
 *
 * @returns A Promise resolving to an object containing:
 *  - `documentUrl`: URL of the uploaded draft order document
 *  - `documentBinaryUrl`: Binary URL for downloading the document
 *  - `uploadTimestamp`: ISO timestamp when the document was uploaded
 *  - `hearingDate`: ISO hearing date as a string
 */
async function progressToProcessOrderEvent(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  uploadDraftOrdersPage: any,
  hearingDate?: string
): Promise<{
  documentUrl: string;
  documentBinaryUrl: string;
  uploadTimestamp: string;
  hearingDate: string;
  fileName: string;
}> {
  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(
    config.caseWorker.email,
    config.caseWorker.password,
    config.manageCaseBaseURL,
    config.loginPaths.worklist
  );
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(ContestedEvents.uploadDraftOrders);
  await uploadDraftOrdersPage.chooseAnAgreedOrderFollowingAHearing();
  await uploadDraftOrdersPage.navigateContinue();
  await uploadDraftOrdersPage.confirmTheUploadedDocsAreForTheCase();
  await uploadDraftOrdersPage.selectFirstAvailableHearing();
  await uploadDraftOrdersPage.chooseWhetherJudgeForHearingIsKnown(YesNoRadioEnum.NO);
  await uploadDraftOrdersPage.chooseUploadOnBehalfOfApplicant();
  await uploadDraftOrdersPage.chooseThatYouAreUploadingOrders();
  await uploadDraftOrdersPage.uploadDraftOrder(caseId);
  await uploadDraftOrdersPage.navigateContinue();
  const eventResponse = await uploadDraftOrdersPage.navigateSubmitAndReturnEventResponse();

  const firstDraftOrderItem = eventResponse?.data?.agreedDraftOrderCollection?.[0]?.value?.draftOrder;
  hearingDate = eventResponse?.data?.hearingDate || hearingDate; 
  hearingDate = hearingDate ?? await DateHelper.getHearingDateUsingCurrentDate();
    const documentDetailsForFutureTestSteps = {
      hearingDate,
      courtOrderDate: hearingDate,
      documentUrl: firstDraftOrderItem?.document_url,
      documentBinaryUrl: firstDraftOrderItem?.document_binary_url,
      uploadTimestamp: firstDraftOrderItem?.upload_timestamp,
      fileName: "agreed-draft-order-document.docx"
    };
  await ContestedEventApi.judgeApproveOrders(caseId, documentDetailsForFutureTestSteps);
  return documentDetailsForFutureTestSteps
}

async function performManageHearingsMigration(
  caseDetailsPage: any,
  blankPage: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await blankPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('(Migration) Manage Hearings');

}

async function performManageHearings(
    caseDetailsPage: any,
    manageHearingPage: any
): Promise<void> {

    await caseDetailsPage.selectNextStep(ContestedEvents.manageHearings);
    await manageHearingPage.assertWhatWouldYouLikeToDoRequired();

    await manageHearingPage.selectAddANewHearing();
    await manageHearingPage.navigateContinue();
    await manageHearingPage.addHearing({
        type: "Pre-Trial Review (PTR)",
        duration: '2 hours',
        date: { day: "03", month: "03", year: "2023" },
        time: '10:00 AM',
        court: {zone: 'London', frc: 'London', courtName: 'CENTRAL FAMILY COURT'},
        attendance: 'Remote - video call',
        additionalInformation: 'by Manage Hearings event.',
        uploadAnySupportingDocuments: false,
        sendANoticeOfHearing: true
    });

    await manageHearingPage.navigateContinue();
    await manageHearingPage.navigateIgnoreWarningAndContinue();
    await manageHearingPage.navigateSubmit();
}

test.describe('Contested - Process Order (Old Style)', () => {
  test(
    'Form A case creating a hearing from Process Order',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage, 
        unprocessedApprovedOrdersPage, 
        processOrderPage,
        checkYourAnswersPage,
        axeUtils
      }, testInfo
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrderWithMigratedHearing({ isFormA: true });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing();
      await axeUtils.audit();
      await processOrderPage.navigateContinue();

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithOldHearingTable("Yes", "1 hour", "01/01/2024", "10:00", "North West", "Directions (DIR)"));
      await processOrderPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
    }
  );

  test(
    'Paper Case creating a hearing from Process Order',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        unprocessedApprovedOrdersPage, 
        processOrderPage, 
        checkYourAnswersPage,
        axeUtils
      }, testInfo
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrderWithMigratedHearing({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing();
      await axeUtils.audit();
      await processOrderPage.navigateContinue();

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithOldHearingTable("Yes", "1 hour", "01/01/2024", "10:00", "North West", "Directions (DIR)"));
      await processOrderPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
    }
  );

  // non-prod only
  test(
    'Form A case shows old-style Process Order hearings on the new hearing tab',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage
      },
      testInfo
    ) => {
     const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
     const hearingDate = await DateHelper.getHearingDateUsingCurrentDate();
      await ContestedEventApi.caseWorkerPerformsAddAHearing(caseId, hearingDate);
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, hearingDate);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      // Skip the unprocessed approved orders page
      await processOrderPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing();

      await processOrderPage.navigateContinue();
      await processOrderPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Process Order');

      await performManageHearingsMigration(caseDetailsPage, blankPage);
      await caseDetailsPage.assertTabData(generateHearingsTabData([
        {
          typeOfHearing: "Directions (DIR)",
          court: "Chester Civil And Family Justice Centre",
          hearingAttendance: "Hearing mode not specified",
          hearingDate: "01 Jan 2024 10:00",
          hearingTimeEstimate: "1 hour",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "",
          hearingDocuments: undefined
        },
        {
          typeOfHearing: "First Directions Appointment (FDA)",
          court: "Manchester County And Family Court",
          hearingAttendance: "In Person",
          hearingDate: DateHelper.getFormattedDateTwelveWeeksLater() + " 10:00am",
          hearingTimeEstimate: "1hr 20mins",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "This is additional information about the hearing",
          hearingDocuments: "HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf\nDummy QA copy.doc"
        }
      ]));

    }
  );

  // non-prod only
  test(
    'Paper case shows old-style Process Order hearings on the new hearing tab',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage
      }
    ) => {
     const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      const hearingDate = await DateHelper.getHearingDateUsingCurrentDate();
      await ContestedEventApi.caseWorkerPerformsAddAHearing(caseId, hearingDate);
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      // Skip the unprocessed approved orders page
      await processOrderPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing({
        hearing_position: firstHearing,
        courtRegion: "North West",
        courtFrc: "Liverpool",
        localCourt: "CHESTER CIVIL AND FAMILY JUSTICE CENTRE"
      });

      await processOrderPage.addNewNextHearingDetails();

      const secondHearing = 1;
      await processOrderPage.selectIsAnotherHearingToBeListed(secondHearing, true);
      await processOrderPage.enterTimeEstimate(secondHearing, '2 hours');
      await processOrderPage.enterHearingDate(secondHearing, '02', '01', '2024');
      await processOrderPage.enterHearingTime(secondHearing, '11:00');
      await processOrderPage.selectTypeOfHearing(secondHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing({
        hearing_position: secondHearing,
        courtRegion: "London",
        courtFrc: "London",
        courtFrcCode: "cfc",
        localCourt: "BROMLEY COUNTY COURT AND FAMILY COURT"
      });

      await processOrderPage.navigateContinue();
      await processOrderPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Process Order');

      await performManageHearingsMigration(caseDetailsPage, blankPage);
      await caseDetailsPage.assertTabData(generateHearingsTabData([
  {
          typeOfHearing: "Directions (DIR)",
          court: "Chester Civil And Family Justice Centre",
          hearingAttendance: "Hearing mode not specified",
          hearingDate: "01 Jan 2024 10:00",
          hearingTimeEstimate: "1 hour",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "",
          hearingDocuments: undefined
        },
        {
          typeOfHearing: "Directions (DIR)",
          court: "Bromley County Court And Family Court",
          hearingAttendance: "Hearing mode not specified",
          hearingDate: "02 Jan 2024 11:00",
          hearingTimeEstimate: "2 hours",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "",
          hearingDocuments: undefined
        },
        {
          typeOfHearing: "First Directions Appointment (FDA)",
          court: "Manchester County And Family Court",
          hearingAttendance: "In Person",
          hearingDate: DateHelper.getFormattedDateTwelveWeeksLater() + " 10:00am",
          hearingTimeEstimate: "1hr 20mins",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "This is additional information about the hearing",
          hearingDocuments: "HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf\nDummy QA copy.doc"
        },
      ]));
    }
  )

  // non-prod only
  test(
    'Paper case shows old-style Process Order hearings on the new hearing tab after any manage hearings event',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage,
        manageHearingPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createAndSubmitPaperCase();
      const hearingDate = await DateHelper.getHearingDateUsingCurrentDate();
      await ContestedEventApi.caseWorkerPerformsAddAHearing(caseId, hearingDate);
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      // Skip the unprocessed approved orders page
      await processOrderPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing({
        hearing_position: firstHearing,
        courtRegion: "North West",
        courtFrc: "Liverpool",
        localCourt: "CHESTER CIVIL AND FAMILY JUSTICE CENTRE"
      });

      await processOrderPage.addNewNextHearingDetails();

      const secondHearing = 1;
      await processOrderPage.selectIsAnotherHearingToBeListed(secondHearing, true);
      await processOrderPage.enterTimeEstimate(secondHearing, '2 hours');
      await processOrderPage.enterHearingDate(secondHearing, '02', '01', '2024');
      await processOrderPage.enterHearingTime(secondHearing, '11:00');
      await processOrderPage.selectTypeOfHearing(secondHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing({
        hearing_position: secondHearing,
        courtRegion: "London",
        courtFrc: "London",
        courtFrcCode: "cfc",
        localCourt: "BROMLEY COUNTY COURT AND FAMILY COURT"
      });

      await processOrderPage.navigateContinue();
      await processOrderPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Process Order');
      await performManageHearings(caseDetailsPage, manageHearingPage);

      await performManageHearingsMigration(caseDetailsPage, blankPage);
      await caseDetailsPage.assertTabData(generateHearingsTabData([
        {
          typeOfHearing: "Pre-Trial Review (PTR)",
          court: "Central Family Court",
          hearingAttendance: "Remote - Video call",
          hearingDate: "03 Mar 2023 10:00 AM",
          hearingTimeEstimate: "2 hours",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "by Manage Hearings event.",
          hearingDocuments: "HearingNotice.pdf"
        },
        {
          typeOfHearing: "Directions (DIR)",
          court: "Chester Civil And Family Justice Centre",
          hearingAttendance: "Hearing mode not specified",
          hearingDate: "01 Jan 2024 10:00",
          hearingTimeEstimate: "1 hour",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "",
          hearingDocuments: undefined
        },
        {
          typeOfHearing: "Directions (DIR)",
          court: "Bromley County Court And Family Court",
          hearingAttendance: "Hearing mode not specified",
          hearingDate: "02 Jan 2024 11:00",
          hearingTimeEstimate: "2 hours",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "",
          hearingDocuments: undefined
        },
        {
          typeOfHearing: "First Directions Appointment (FDA)",
          court: "Manchester County And Family Court",
          hearingAttendance: "In Person",
          hearingDate: DateHelper.getFormattedDateTwelveWeeksLater() + " 10:00am",
          hearingTimeEstimate: "1hr 20mins",
          whoHasReceivedThisNotice: "Applicant - Frodo Baggins, Respondent - Smeagol Gollum",
          additionalInformation: "This is additional information about the hearing",
          hearingDocuments: "HearingNotice.pdf\nForm-G.pdf\nPfdNcdrComplianceLetter.pdf\nPfdNcdrCoverLetter.pdf\nOutOfFamilyCourtResolution.pdf\nForm-C.pdf\nDummy QA copy.doc"
        },
      ]));
    }
  )
});


// New Style Process Order hearings
test.describe('Contested - Process Order (Manage Hearings)', () => {
  test(
    'Form A case creating a hearing from Process Order (MH)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage, 
        unprocessedApprovedOrdersPage, 
        processOrderHearingDetailsPage,
        checkYourAnswersPage,
        axeUtils
      }, testInfo
    ) => {

      const caseId = await ContestedCaseFactory.progressToUploadDraftOrderWithMigratedHearing({ isFormA: true });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrderMH);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders("agreed-draft-order-document.docx");
      await axeUtils.audit({
        exclude:[
          'div:nth-child(4) > ccd-read-document-field > a[href="javascript:void(0)"]'
        ]
      });
      await unprocessedApprovedOrdersPage.navigateContinue();

      // Add Hearing 
      await processOrderHearingDetailsPage.selectIsAnotherHearingToBeListed(true);
      await processOrderHearingDetailsPage.selectTypeOfHearing("First Directions Appointment (FDA)");
      await processOrderHearingDetailsPage.enterTimeEstimate("30");
      await processOrderHearingDetailsPage.enterHearingDate("01", "01", "2024");
      await processOrderHearingDetailsPage.enterHearingTime("10:00")
      await processOrderHearingDetailsPage.selectCourtForHearing();
      await processOrderHearingDetailsPage.selectHearingAttendance("In person");
      await processOrderHearingDetailsPage.enterAdditionalHearingInformation("This is a test hearing");
      await processOrderHearingDetailsPage.selectAdditionalHearingDocument(false);
      await processOrderHearingDetailsPage.selectSendNoticeOfHearing(true);
      await axeUtils.audit({
        exclude: [
          '#unprocessedApprovedDocuments_0_uploadDraftDocument'
        ]
      });
      await processOrderHearingDetailsPage.navigateContinue(); 

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithNewHearingTable);
      await processOrderHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrderMH.listItem);
      await caseDetailsPage.assertTabData(processOrderHearingTabData);
      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
    }
  );

  test(
    'Paper Case creating a hearing from Process Order (MH)',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage, 
        unprocessedApprovedOrdersPage, 
        processOrderHearingDetailsPage,
        checkYourAnswersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrderWithMigratedHearing({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrderMH);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders("agreed-draft-order-document.docx");
      await unprocessedApprovedOrdersPage.navigateContinue();

      // Add Hearing 
      await processOrderHearingDetailsPage.selectIsAnotherHearingToBeListed(true);
      await processOrderHearingDetailsPage.selectTypeOfHearing("First Directions Appointment (FDA)");
      await processOrderHearingDetailsPage.enterTimeEstimate("30");
      await processOrderHearingDetailsPage.enterHearingDate("01", "01", "2024");
      await processOrderHearingDetailsPage.enterHearingTime("10:00")
      await processOrderHearingDetailsPage.selectCourtForHearing();
      await processOrderHearingDetailsPage.selectHearingAttendance("In person");
      await processOrderHearingDetailsPage.enterAdditionalHearingInformation("This is a test hearing");
      await processOrderHearingDetailsPage.selectAdditionalHearingDocument(false);
      await processOrderHearingDetailsPage.selectSendNoticeOfHearing(true);
      await processOrderHearingDetailsPage.navigateContinue(); 

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithNewHearingTable);
      await processOrderHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrderMH.listItem);
      await caseDetailsPage.assertTabData(processOrderHearingTabData);
      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
    }
  );
});
