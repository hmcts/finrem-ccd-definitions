import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { unprocessedApprovedOrdersWithHearingTable } from '../../../resources/check_your_answer_content/FR_directionOrder/proessOrderTable';
import { processOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs';
import { DateHelper } from '../../../data-utils/DateHelper';
import { draftOrderApprove } from '../../../../test/functional/pages/draft-order-approve/draft-order-approve';
import { draftOrdersApprovedWithHearingTabData } from '../../../resources/tab_content/contested/draft_orders_tabs';

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
    await uploadDraftOrdersPage.navigateAddNew();
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

test.describe('Contested - Process Order', () => {
  test(
    'Form A case creating a hearing from Process Order',
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
      await caseDetailsPage.selectNextStep(ContestedEvents.directionOrder);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      // Add Hearing 
      await nextHearingDetailsPage.addHearing(); 
      await nextHearingDetailsPage.navigateContinue(); 

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithHearingTable);
      await nextHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.directionOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(draftOrdersApprovedWithHearingTabData); 

    }
  );

  test(
    'Paper Case creating a hearing from Process Order',
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
      await caseDetailsPage.selectNextStep(ContestedEvents.directionOrder);

      // Check unapproved draft order tab
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedApprovedOrders(orderDoc.fileName);
      await unprocessedApprovedOrdersPage.navigateContinue();

      // Add Hearing 
      await nextHearingDetailsPage.addHearing(); 
      await nextHearingDetailsPage.navigateContinue(); 

      // Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(unprocessedApprovedOrdersWithHearingTable);
      await nextHearingDetailsPage.navigateSubmit();

      // Assert case details content
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.directionOrder.listItem);

      await caseDetailsPage.assertTabData(processOrderCaseDocumentsTabData);
      await caseDetailsPage.assertTabData(draftOrdersApprovedWithHearingTabData); 
    }
  );

  test(
    'Form A case shows old-style Process Order hearings on the new hearing tab',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
      const orderDetails = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);
      await ContestedEventApi.caseWorkerProcessOrder(caseId, orderDetails);

      // Next
      // Check that the draft order tab is correct; Uploaded draft orders 1 should have an "Order status" of "Processed" (has changed from Approved by Judge).
      // Case Documents tab should the agreed draft order to have "Document status" of "Processed".
    }
  );

  test(
    'Paper case shows old-style Process Order hearings on the new hearing tab',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: false });
      const orderDetails = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);
      await ContestedEventApi.caseWorkerProcessOrder(caseId, orderDetails);

      // Next
      // Check that the draft order tab is correct; Uploaded draft orders 1 should have an "Order status" of "Processed" (change from Approved by Judge).
      // Case Documents tab should the agreed draft order to have "Document status" of "Processed".
    }
  )
});
