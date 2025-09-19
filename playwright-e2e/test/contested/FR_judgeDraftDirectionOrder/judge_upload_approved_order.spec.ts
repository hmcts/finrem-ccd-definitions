import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { judgeUploadApprovedOrderTableData } from '../../../resources/check_your_answer_content/judge_approved_order/judgeApprovedOrderTable';

// New describe block for Judge Upload Approved order
test.describe('Contested - Judge Upload Approved Order', () => {
  test(
    'Contested - FormA - Judge uploads approved order without hearing',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      judgeUploadApprovedOrderPage,
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
      await judgeUploadApprovedOrderPage.uploadAdditionalAttachment('additionalAttachment.pdf');
      await judgeUploadApprovedOrderPage.selectJudgeFromDropdown('Deputy District Judge');
      await judgeUploadApprovedOrderPage.enterNameOfJudge('Judge Judy');
      await judgeUploadApprovedOrderPage.enterCourtOrderDate('01', '01', '2026');
      await judgeUploadApprovedOrderPage.navigateContinue();

      // Draft Direction Orders Details
      await judgeUploadApprovedOrderPage.enterDraftDirectionOrderDetails(YesNoRadioEnum.YES, YesNoRadioEnum.NO);
      await judgeUploadApprovedOrderPage.navigateContinue();

      //Check your answers
      await checkYourAnswersPage.assertCheckYourAnswersPage(judgeUploadApprovedOrderTableData);
      await judgeUploadApprovedOrderPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.judgeUploadApprovedOrder.listItem);

      // await manageCaseDashboardPage.signOut();

      // Caseworker login and Send Order
      // await loginPage.loginWaitForPath(config.caseworker.email, config.caseworker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      // await manageCaseDashboardPage.navigateToCase(caseId);
      // await caseDetailsPage.selectNextStep(ContestedEvents.caseworkerSendOrder);
      // await caseDetailsPage.confirmSendOrder();

      // Accessibility audit and tab data check (add your own checks as needed)
      // await axeUtils.audit({});
      // await caseDetailsPage.assertTabData(judgeApprovedOrderTabData); // Uncomment and provide data if needed
    }
  );
});
