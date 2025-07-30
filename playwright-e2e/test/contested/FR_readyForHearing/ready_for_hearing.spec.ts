import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { updateSchedulingAndListingTabData } from '../../../resources/tab_content/contested/scheduling_and_listing_tab';


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
      return documentDetailsForFutureTestSteps;
    }

test.describe('Contested - Ready For Hearing', () => {
  test(
    'Form A case up to List for Hearing @test',
    { tag: ['@process-order'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        submitUploadedCaseFilesPage,
      }
    ) => {
        
    const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
    let expectedUrl = ContestedEvents.uploadDraftOrders.ccdCallback;
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Submit Uploaded Case Files 
    await caseDetailsPage.selectNextStep(ContestedEvents.submitUploadedCaseFiles);
    await submitUploadedCaseFilesPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.submitUploadedCaseFiles.listItem);
    await caseDetailsPage.assertTabData(updateSchedulingAndListingTabData);
  });
});
