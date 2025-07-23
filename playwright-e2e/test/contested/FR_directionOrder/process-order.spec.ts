import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { migratedHearingsCreatedFromProcessOrderTabData, processOrderHearingTabData } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { migratedMultipleHearingsCreatedFromProcessOrderTabData } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { migratedMultipleHearingsCreatedFromProcessOrderWithAnyManageHearingsEventTabData } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import { unprocessedApprovedOrdersWithNewHearingTable, unprocessedApprovedOrdersWithOldHearingTable } from '../../../resources/check_your_answer_content/FR_directionOrder/proessOrderTable.ts';
import { processOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs.ts';
import { createDraftOrdersApprovedWithHearingTabData } from '../../../resources/tab_content/contested/draft_orders_tabs.ts';

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
  uploadDraftOrdersPage: any
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
  const hearingDate = eventResponse?.data?.hearingDate;

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
  blankPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await blankPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('(Migration) Manage Hearings');

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
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
        checkYourAnswersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.directionOrder);

      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing();
      await processOrderPage.navigateContinue();

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithOldHearingTable("Yes", "1 hour", "01/01/2024", "10:00", "North West", "Directions (DIR)"));
      await processOrderPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.directionOrder.listItem);

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
        checkYourAnswersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.directionOrder);

      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      const firstHearing = 0;
      await processOrderPage.selectIsAnotherHearingToBeListed(firstHearing, true);
      await processOrderPage.enterTimeEstimate(firstHearing, '1 hour');
      await processOrderPage.enterHearingDate(firstHearing, '01', '01', '2024');
      await processOrderPage.enterHearingTime(firstHearing, '10:00');
      await processOrderPage.selectTypeOfHearing(firstHearing, 'Directions (DIR)');
      await processOrderPage.selectCourtForHearing();
      await processOrderPage.navigateContinue();

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithOldHearingTable("Yes", "1 hour", "01/01/2024", "10:00", "North West", "Directions (DIR)"));
      await processOrderPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.directionOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate)); 
    }
  );

  // non-prod only
  test.skip(
    'Form A case shows old-style Process Order hearings on the new hearing tab',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage,
        makeAxeBuilder
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
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
      await processOrderPage.selectCourtForHearing();

      await processOrderPage.navigateContinue();
      await processOrderPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated('Process Order');

      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedHearingsCreatedFromProcessOrderTabData());
    }
  );

  // non-prod only
  test.skip(
    'Paper case shows old-style Process Order hearings on the new hearing tab',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage,
        makeAxeBuilder
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
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

      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedMultipleHearingsCreatedFromProcessOrderTabData());
    }
  )

  // non-prod only
  test.skip(
    'Paper case shows old-style Process Order hearings on the new hearing tab after any manage hearings event.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        processOrderPage,
        blankPage,
        manageHearingPage,
        makeAxeBuilder
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
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

      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, makeAxeBuilder);
      await caseDetailsPage.assertTabData(migratedMultipleHearingsCreatedFromProcessOrderWithAnyManageHearingsEventTabData());
    }
  )
});


// New Style Process Order hearings
test.describe('Contested - Process Order (Mange Hearings)', () => {
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
        nextHearingDetailsPage,
        checkYourAnswersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders("agreed-draft-order-document.docx");
      await unprocessedApprovedOrdersPage.navigateContinue();

      // // Add Hearing 
      await nextHearingDetailsPage.addNewHearing(); 
      await nextHearingDetailsPage.navigateContinue(); 

      // // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithNewHearingTable);
      await nextHearingDetailsPage.navigateSubmit();

      // // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate)); 
      await caseDetailsPage.assertTabData(processOrderHearingTabData);

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
        nextHearingDetailsPage,
        checkYourAnswersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders("agreed-draft-order-document.docx");
      await unprocessedApprovedOrdersPage.navigateContinue();

      // // Add Hearing 
      await nextHearingDetailsPage.addNewHearing(); 
      await nextHearingDetailsPage.navigateContinue(); 

      // // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithNewHearingTable);
      await nextHearingDetailsPage.navigateSubmit();

      // // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
      await caseDetailsPage.assertTabData(processOrderHearingTabData);
    }
  );

});
