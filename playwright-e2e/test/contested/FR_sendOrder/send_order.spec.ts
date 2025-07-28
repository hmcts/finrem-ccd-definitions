import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { sendOrderTableData } from '../../../resources/check_your_answer_content/send_order/sendOrderTable';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { DateHelper } from '../../../data-utils/DateHelper';
import { contestedSendOrderTabData } from '../../../resources/tab_content/contested/send_order_tab';

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
      uploadTimestamp: firstDraftOrderItem?.upload_timestamp
    };

    await ContestedEventApi.judgeApproveOrders(caseId, documentDetailsForFutureTestSteps);
    return documentDetailsForFutureTestSteps
  }

test.describe('Contested - Process and Send Order', () => {
  test(
    'Form A case creating a hearing from Process Order',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        sendOrderPage,
        checkYourAnswersPage,
      }
    ) => {
        
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProcessOrder();
    
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.caseWorker.email,
      config.caseWorker.password,
      config.manageCaseBaseURL,
      config.loginPaths.worklist
    );

    await manageCaseDashboardPage.navigateToCase(caseId);

    // Send Order
    await caseDetailsPage.selectNextStep(ContestedEvents.contestedSendOrder);
    await sendOrderPage.selectSendApprovedOrder();
    await sendOrderPage.navigateContinue();
    await sendOrderPage.navigateContinue();
    await sendOrderPage.uploadDocument('./playwright-e2e/resources/file/test.docx');
    await sendOrderPage.navigateContinue();
    await sendOrderPage.clickCaseStateButton();
    await sendOrderPage.selectCaseState('Order Sent');
    await sendOrderPage.navigateContinue();

    // Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(sendOrderTableData); 
    await sendOrderPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.contestedSendOrder.listItem);

    // Assert Order tab data
    await caseDetailsPage.assertTabData(contestedSendOrderTabData);
    }
  );
});
