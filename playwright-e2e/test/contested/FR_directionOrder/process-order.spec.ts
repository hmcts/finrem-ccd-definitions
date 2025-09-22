import {test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {ContestedEvents} from '../../../config/case-data';
import {YesNoRadioEnum} from '../../../pages/helpers/enums/RadioEnums';
import {ContestedEventApi} from '../../../data-utils/api/contested/ContestedEventApi';
import {processOrderHearingTabData} from '../../../resources/tab_content/contested/hearings_tabs.ts';
import {
  unprocessedApprovedOrdersWithNewHearingTable
} from '../../../resources/check_your_answer_content/FR_directionOrder/proessOrderTable.ts';
import {processOrderCaseDocumentsTabData} from '../../../resources/tab_content/contested/case_document_tabs.ts';
import {
  createDraftOrdersApprovedWithHearingTabData
} from '../../../resources/tab_content/contested/draft_orders_tabs.ts';
import {DateHelper} from '../../../data-utils/DateHelper.ts';

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
  hearingDate = hearingDate ?? await DateHelper.getHearingDateTwelveWeeksLaterInISOFormat();
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
      }
    ) => {

      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

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
      await processOrderHearingDetailsPage.enterAdditionalInformationAboutHearing("This is a test hearing");
      await processOrderHearingDetailsPage.selectAdditionalHearingDocument(YesNoRadioEnum.NO);
      await processOrderHearingDetailsPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
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
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);
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
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
      const orderDoc = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);

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
      await processOrderHearingDetailsPage.enterAdditionalInformationAboutHearing("This is a test hearing");
      await processOrderHearingDetailsPage.selectAdditionalHearingDocument(YesNoRadioEnum.NO);
      await processOrderHearingDetailsPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
      await processOrderHearingDetailsPage.navigateContinue(); 

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithNewHearingTable);
      await processOrderHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);
      await caseDetailsPage.assertTabData(processOrderHearingTabData);
      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(createDraftOrdersApprovedWithHearingTabData(orderDoc.hearingDate));
    }
  );

  test(
    'Form A case Process Order (MH) with no hearing added',
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
      },
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrderWithMigratedHearing({ isFormA: true });
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrderMH);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders("agreed-draft-order-document.docx");
      await unprocessedApprovedOrdersPage.navigateContinue();

      // Do NOT add a hearing, just continue
      await processOrderHearingDetailsPage.selectIsAnotherHearingToBeListed(false);
      await processOrderHearingDetailsPage.navigateContinue();

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersNoHearingTable);
      await processOrderHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrderMH.listItem);
      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
    }
  );
});
