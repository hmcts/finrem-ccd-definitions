import {test} from "../../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import config from "../../../config/config.ts";
import {ContestedEvents} from "../../../config/case-data.ts";
import {YesNoRadioEnum} from "../../../pages/helpers/enums/RadioEnums.ts";


test.describe('Contested - Upload Draft Order', () => {
  test(
    'Form A case uploading a draft order',
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

      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      await caseDetailsPage.selectNextStep(ContestedEvents.uploadDraftOrders);

      await uploadDraftOrdersPage.chooseAnAgreedOrderFollowingAHearing();

      await uploadDraftOrdersPage.confirmTheUploadedDocsAreForTheCase();

      await uploadDraftOrdersPage.selectFirstAvailableHearing();
      await uploadDraftOrdersPage.chooseWhetherJudgeForHearingIsKnown(YesNoRadioEnum.NO);


    }
  );
}

);
