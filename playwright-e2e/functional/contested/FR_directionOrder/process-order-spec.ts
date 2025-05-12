import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { CaseDataHelper } from '../../helpers/CaseDataHelper';
import { contestedEvents } from '../../../config/case_events';
import { PayloadHelper } from '../../helpers/PayloadHelper';
import { DocumentHelper } from '../../helpers/DocumentHelper';
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
      await performUploadDraftOrderFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, testInfo, makeAxeBuilder);
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
      await performUploadDraftOrderFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage, testInfo, makeAxeBuilder);
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
    await DocumentHelper.updateDraftOrderDocument(caseId);
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

  async function performUploadDraftOrderFlow(
    caseId: string,
    loginPage: any,
    manageCaseDashboardPage: any,
    caseDetailsPage: any,
    uploadDraftOrdersPage: any,
    testInfo: any,
    makeAxeBuilder: any
  ): Promise<void> {
    const hearingType = "Final Hearing (FH)";
    const courtName = "CHESTERFIELD COUNTY COURT";

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
    await uploadDraftOrdersPage.checkThatYouAreUploadingOrders();
    await uploadDraftOrdersPage.navigateAddNew();
    // Next upload the draft order document

    //Next, continue tests to drive through new hearing creation

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
