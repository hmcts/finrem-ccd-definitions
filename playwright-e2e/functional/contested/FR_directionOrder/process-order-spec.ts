import { expect, test } from '../../../fixtures/fixtures';
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
      },
      testInfo
    ) => {
      const caseId = await progressToUploadDraftOrderForFormACase();
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);

      // await performGeneralApplicationDirectionsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, generalApplicationDirectionsPage, testInfo, makeAxeBuilder);
      // Next:
      // When add hearing complete, then use that page structure to build and test from this point
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
      },
      testInfo
    ) => {
      const caseId = await progressToUploadDraftOrderForPaperCase();
      await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage);
      // await progressToProcessOrderEvent(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, testInfo, makeAxeBuilder);
      // Next:
      // When add hearing complete, then use that page structure to build and test from this point
    }
  );

  test.skip(
    'Form A case shows old-style Process Order hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await createOldProcessOrderHearingForFormACase();
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
    }
  );

  test.skip(
    'Paper case shows old-style Process Order hearings on the new hearing tab',
    { tag: [] },
    async () => {
      const caseId = await createOldProcessOrderHearingForPaperCase();
      // Next:
      // Check the hearing tab to check that the old hearing data is correctly showing there.
      // Remove the skip when the test is ready.
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

  async function createOldProcessOrderHearingForFormACase(): Promise<string> {
    const caseId = await CaseDataHelper.createBaseContestedFormA();
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseWorkerIssueApplication(caseId)
    // todo await PayloadHelper.caseWorkerCreateOldProcessOrderHearing(caseId);
    // was await PayloadHelper.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
    return caseId;
  }

  async function createOldProcessOrderHearingForPaperCase(): Promise<string> {
    const caseId = await CaseDataHelper.createBaseContestedPaperCase();
    await PayloadHelper.caseWorkerSubmitPaperCase(caseId);
    // todo await PayloadHelper.caseWorkerCreateOldProcessOrderHearing(caseId);
    // was await PayloadHelper.caseWorkerCreateOldGeneralApplicationDirectionsHearing(caseId);
    return caseId;
  }

/**
 * Firstly, performs the upload draft order flow as a step towards the Process Order event.
 * This could be done via API call, after work done so Playwright can directly upload files
 * to Document Management API.  The current service token authenticates, but isn't authorised.
 * On submit, gets information from the response body and uses to Approve Orders.
 *
 * Secondly, uses PayloadHelper to perform the Approve Orders event.
 */
async function progressToProcessOrderEvent(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  uploadDraftOrdersPage: any,
  ): Promise<void> {
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

    // Get the data for the first draft order from the response, to use in the next step.
    const firstDraftOrderItem = eventResponse?.data?.agreedDraftOrderCollection?.[0]?.value?.draftOrder;
    const hearingDate = eventResponse?.data?.hearingDate;
    const detailsToApproveOrders = {
      documentUrl: firstDraftOrderItem?.document_url,
      documentBinaryUrl: firstDraftOrderItem?.document_binary_url,
      uploadTimestamp: firstDraftOrderItem?.upload_timestamp,
      hearingDate
    };

    await PayloadHelper.judgeApproveOrders(caseId, detailsToApproveOrders);
  }

});
