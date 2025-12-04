import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { judgeUploadApprovedOrderTableData } from '../../../resources/check_your_answer_content/judge_approved_order/judgeApprovedOrderTable';
import { judgeApprovedOrderTabData } from '../../../resources/tab_content/contested/judge_approved_order_tab';
import { AxeUtils } from '@hmcts/playwright-common';

test.describe('Contested - Judge Upload Approved Order', () => {
  test(
    'Contested - FormA - Judge uploads approved order without hearing',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      judgeUploadApprovedOrderPage,
      unprocessedApprovedOrdersPage,
      processOrderHearingDetailsPage,
      axeUtils,
      checkYourAnswersPage
    }, testInfo) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.caseWorkerPerformsAddAHearing(caseId);

      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Judge uploads order
      await caseDetailsPage.selectNextStep(ContestedEvents.judgeUploadApprovedOrder);
      await judgeUploadApprovedOrderPage.uploadApprovedOrderDocument('judgeApprovedOrder.docx');
      await judgeUploadApprovedOrderPage.navigateAddNew();
      await judgeUploadApprovedOrderPage.uploadApprovedOrderDocument('judgeApprovedOrder2.pdf', 1);
      await judgeUploadApprovedOrderPage.uploadAdditionalAttachment('additionalAttachment.pdf');
      await judgeUploadApprovedOrderPage.selectJudgeFromDropdown('Deputy District Judge');
      await judgeUploadApprovedOrderPage.enterNameOfJudge('Judge Judy');
      await judgeUploadApprovedOrderPage.enterCourtOrderDate('01', '01', '2026');
      await axeUtils.audit({
        exclude: [
          '#judgeApprovedOrderCollection_0_additionalDocuments_value'
        ]
      });
      await judgeUploadApprovedOrderPage.navigateContinue();

      // Draft Direction Orders Details
      await judgeUploadApprovedOrderPage.enterDraftDirectionOrderDetails(YesNoRadioEnum.YES, YesNoRadioEnum.NO);
      await judgeUploadApprovedOrderPage.navigateContinue();

      //Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(judgeUploadApprovedOrderTableData);
      await judgeUploadApprovedOrderPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.judgeUploadApprovedOrder.listItem);
      await manageCaseDashboardPage.signOut();

      //sign in as caseworker and process order
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.selectNextStep(ContestedEvents.processOrder);
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedHearingOrders('judgeApprovedOrder.docx');
      await unprocessedApprovedOrdersPage.checkOrderIsInUnprocessedHearingOrders('judgeApprovedOrder2.pdf');
      await unprocessedApprovedOrdersPage.navigateContinue();
      await processOrderHearingDetailsPage.selectIsAnotherHearingToBeListed(false);
      await processOrderHearingDetailsPage.navigateContinue();
      await processOrderHearingDetailsPage.navigateSubmit();
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.processOrder.listItem);

      // Assert tab data
      await caseDetailsPage.assertTabData(judgeApprovedOrderTabData);
    }
  );
});
