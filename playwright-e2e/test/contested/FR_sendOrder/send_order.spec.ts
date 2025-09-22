import {test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {ContestedEvents} from '../../../config/case-data';
import {sendOrderTableData} from '../../../resources/check_your_answer_content/send_order/sendOrderTable';
import {contestedSendOrderTabData} from '../../../resources/tab_content/contested/send_order_tab';

test.describe('Contested - Approved and Send Order', () => {
  test(
    'Form A case up to process order and send order',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        sendOrderPage,
        checkYourAnswersPage,
        axeUtils,
      }, testInfo
    ) => {
        
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToProcessOrderLegacy();
    
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
    await axeUtils.audit();
    await sendOrderPage.navigateContinue();
    await axeUtils.audit();
    await sendOrderPage.navigateContinue();
    await sendOrderPage.uploadDocument('./playwright-e2e/resources/file/test.docx');
    await axeUtils.audit();
    await sendOrderPage.navigateContinue();
    await sendOrderPage.clickCaseStateButton();
    await sendOrderPage.selectCaseState('Order Sent');
    await axeUtils.audit();
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
