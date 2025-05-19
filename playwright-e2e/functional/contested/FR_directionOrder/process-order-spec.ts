import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';

test.describe('Contested - Process Order', () => {
  test(
    'Form A case creating a hearing from Process Order',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage
      }
    ) => {
      const caseId = await progressToUploadDraftOrderForFormACase();
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      // Next
      // Actually test the process order event, when new hearings are introduced to the flow.
      // Check that the draft order tab is correct; Uploaded draft orders 1 should have an "Order status" of "Processed" (has changed from Approved by Judge).
      // Case Documents tab should the agreed draft order to have "Document status" of "Processed".
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
        uploadDraftOrdersPage
      }
    ) => {
      const caseId = await progressToUploadDraftOrderForPaperCase();
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      // Next
      // Actually test the process order event, when new hearings are introduced to the flow.
      // Check that the draft order tab is correct; Uploaded draft orders 1 should have an "Order status" of "Processed" (has changed from Approved by Judge).
      // Case Documents tab should the agreed draft order to have "Document status" of "Processed".
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
      const caseId = await progressToUploadDraftOrderForFormACase();
      const orderDetails = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);
      await PayloadHelper.caseWorkerProcessOrder(caseId, orderDetails);

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
      const caseId = await progressToUploadDraftOrderForPaperCase();
      const orderDetails = await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);
      await PayloadHelper.caseWorkerProcessOrder(caseId, orderDetails);

      // Next
      // Check that the draft order tab is correct; Uploaded draft orders 1 should have an "Order status" of "Processed" (change from Approved by Judge).
      // Case Documents tab should the agreed draft order to have "Document status" of "Processed".
    }
  );

  async function progressToUploadDraftOrderForFormACase(): Promise<string> {
    const caseId = await CaseDataHelper.createBaseContestedFormA();
    const processAsFormACase = true;
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseworkerListForHearing12To16WeeksFromNow(caseId, processAsFormACase);
    return caseId;
  }

  async function progressToUploadDraftOrderForPaperCase(): Promise<string> {
    const caseId = await CaseDataHelper.createBaseContestedPaperCase();
    const processAsFormACase = false;
    await PayloadHelper.caseworkerListForHearing12To16WeeksFromNow(caseId, processAsFormACase);
    return caseId;
  }

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
  }> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.caseWorker.email,
      config.caseWorker.password,
      config.manageCaseBaseURL,
      config.loginPaths.worklist
    );
    await manageCaseDashboardPage.navigateToCase(caseId);

    await caseDetailsPage.selectNextStep(contestedEvents.uploadDraftOrders);
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
      documentUrl: firstDraftOrderItem?.document_url,
      documentBinaryUrl: firstDraftOrderItem?.document_binary_url,
      uploadTimestamp: firstDraftOrderItem?.upload_timestamp,
      hearingDate
    };

    await PayloadHelper.judgeApproveOrders(caseId, documentDetailsForFutureTestSteps);
    return documentDetailsForFutureTestSteps
  }
});
