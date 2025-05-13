import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { DateHelper } from '../../helpers/DateHelper';

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
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await progressToUploadDraftOrderForFormACase();
      await performSimpleUploadDraftOrderFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, testInfo, makeAxeBuilder);
      // todo, get to the hearing bit.
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
        uploadDraftOrdersPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await progressToProcessOrderForPaperCase();
      await performSimpleUploadDraftOrderFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, testInfo, makeAxeBuilder);
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
    await PayloadHelper.solicitorSubmitFormACase(caseId);
    await PayloadHelper.caseworkerListForHearing(caseId, await DateHelper.getHearingDateUsingCurrentDate());
    return caseId;
  }

  async function progressToProcessOrderForPaperCase(): Promise<string> {
    const caseId = await CaseDataHelper.createBaseContestedPaperCase();
    await PayloadHelper.caseWorkerProgressPaperCaseToListing(caseId);
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
   * Perform the upload draft order flow as a step towards the Process Order event
   * This could be done via API call, after work done so Playwright can directly upload files
   * to Document Management API.  The current service token authenticates, but isn't authorised.
   */
  async function performSimpleUploadDraftOrderFlow(
    caseId: string,
    loginPage: any,
    manageCaseDashboardPage: any,
    caseDetailsPage: any,
    uploadDraftOrdersPage: any,
    testInfo: any,
    makeAxeBuilder: any
  ): Promise<void> {

    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
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
    const eventPayload = await uploadDraftOrdersPage.navigateSubmitAndReturnEvent();
    console.log(
      eventPayload?.data?.uploadAgreedDraftOrder?.agreedDraftOrderCollection?.[0]?.value?.agreedDraftOrderDocument?.document_url
    );

    // next - see is this is enough to get the approve orders event to work.
    // Use the document url and manually past in a file first.  Either way keep this function, useful.


    if (config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json'
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }

  /**
   * Perform a simple "Approve draft orders" flow as a step towards the Process Order event.
   * The "Approve draft orders" Case Orchestration handler requires proper document information generated by the
   * "Upload draft order" event.  So completing "Approve draft orders" by API call is not appropriate.
   */
  async function performSimpleApproveOrdersFlow(
    caseId: string,
    loginPage: any,
    manageCaseDashboardPage: any,
    caseDetailsPage: any,
    uploadDraftOrdersPage: any,
    testInfo: any,
    makeAxeBuilder: any
  ): Promise<void> {

    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
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
    // await uploadDraftOrdersPage.navigateSubmit();

    if (config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json'
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }
});
