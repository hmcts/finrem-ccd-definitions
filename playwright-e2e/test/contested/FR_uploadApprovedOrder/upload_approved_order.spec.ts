import { expect, test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { CommonEvents, ContestedEvents } from '../../../config/case-data.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import { migratedUploadApprovedOrderTabDataOnHearing1, newUploadApprovedOrderMHTabDataOnHearing1 } from '../../../resources/tab_content/contested/hearings_tabs.ts';
import {AxeUtils} from "../../../fixtures/utils/axe-utils.ts";
import { UploadApprovedOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs.ts';
import { UploadApprovedOrderOrdersTabData } from '../../../resources/tab_content/contested/orders_tab.ts';

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performUploadApprovedOrderFlow(
  caseDetailsPage: any,
  uploadApprovedOrderPage: any,
  testInfo: any,
  axeUtils: AxeUtils
): Promise<void> {
  await caseDetailsPage.selectNextStep(CommonEvents.uploadApprovedOrder);
  await uploadApprovedOrderPage.uploadFirstUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderPage.navigateContinue();
  await uploadApprovedOrderPage.selectJudge('District Judge');
  await uploadApprovedOrderPage.enterJudgeName('District Judge Smith');
  await uploadApprovedOrderPage.enterCourtOrderDate('01', '01', '2022');
  await uploadApprovedOrderPage.navigateContinue();
  await uploadApprovedOrderPage.addNewAdditionalHearingDetails();
  await uploadApprovedOrderPage.selectFirstFinalOrder(YesNoRadioEnum.YES);
  await uploadApprovedOrderPage.selectFirstIsAnotherHearing(YesNoRadioEnum.YES);
  await uploadApprovedOrderPage.enterFirstTimeEstimate('30 minutes');
  await uploadApprovedOrderPage.enterFirstHearingTime('10:00');
  await uploadApprovedOrderPage.enterHearingDate('01', '01', '2022');
  await uploadApprovedOrderPage.selectFirstHearingType('Final Hearing (FH)');

  const courtName: string = "BIRMINGHAM CIVIL AND FAMILY JUSTICE CENTRE";
  await uploadApprovedOrderPage.selectCourtZoneDropDown(courtName);

  await uploadApprovedOrderPage.navigateContinue();
  // CYA page
  await uploadApprovedOrderPage.navigateSubmit();
}

async function performUploadApprovedOrderFlowMH(
  caseDetailsPage: any,
  uploadApprovedOrderPage: any,
  uploadApprovedOrderMHPage: any,
  testInfo: any,
  axeUtils: AxeUtils
): Promise<void> {
  await caseDetailsPage.selectNextStep(ContestedEvents.uploadApprovedOrderMH);
  await uploadApprovedOrderPage.uploadFirstUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderPage.uploadSecondUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderPage.uploadAdditionalAttachment('additionalAttachment.docx');
  await uploadApprovedOrderMHPage.navigateContinue();
  await uploadApprovedOrderPage.selectJudge('District Judge');
  await uploadApprovedOrderPage.enterJudgeName('District Judge Smith');
  await uploadApprovedOrderPage.enterCourtOrderDate('01', '01', '2022');
  await uploadApprovedOrderMHPage.navigateContinue();
  await uploadApprovedOrderMHPage.selectIsThisFinalOrder(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.selectDoYouWantToAddHearing(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.selectTypeOfHearing('First Directions Appointment (FDA)');
  await uploadApprovedOrderMHPage.enterTimeEstimate('3 hours');
  await uploadApprovedOrderMHPage.enterHearingDate('01', '01', '2025');
  await uploadApprovedOrderMHPage.enterHearingTime('10:00');
  await uploadApprovedOrderMHPage.selectCourtForHearing();
  await uploadApprovedOrderMHPage.selectHearingAttendees('Remote - video call');
  await uploadApprovedOrderMHPage.enterAdditionalInformationAboutHearing('This is a test hearing');
  await uploadApprovedOrderMHPage.whetherToUploadOtherDocuments(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.uploadOtherDocuments('OtherDoc.doc');
  await uploadApprovedOrderMHPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);

  await uploadApprovedOrderMHPage.navigateContinue();
  // CYA page
  await uploadApprovedOrderMHPage.navigateSubmit();
}


async function performManageHearingsMigration(
  caseDetailsPage: any,
  blankPage: any,
  testInfo: any,
  axeUtils: any
): Promise<void> {

  await caseDetailsPage.selectNextStep(ContestedEvents.manageHearingsMigration);
  await axeUtils.audit();
  await blankPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('(Migration) Manage Hearings');
}

test.describe('Contested - Upload Approved Order (caseworker)', () => {
  test(
    'Form A case shows old-style hearings created by upload approved order event on the new hearing tab',
    { tag: [] },
    async ({
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadApprovedOrderPage,
        blankPage,
        axeUtils,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
      await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
      await performUploadApprovedOrderFlow(caseDetailsPage, uploadApprovedOrderPage, testInfo, axeUtils);
      await performManageHearingsMigration(caseDetailsPage, blankPage, testInfo, axeUtils);
      await caseDetailsPage.assertTabData(migratedUploadApprovedOrderTabDataOnHearing1);
    }
  );
  
  test('New Upload Approved Order (MH) event with hearing', { tag: [] }, async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    uploadApprovedOrderPage,
    uploadApprovedOrderMHPage,
    axeUtils,
  },
  testInfo
  ) => {
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
    await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
    await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
    await performUploadApprovedOrderFlowMH(caseDetailsPage, uploadApprovedOrderPage, uploadApprovedOrderMHPage, testInfo, axeUtils);
    // Verify data on hearings, case documents and orders tabs
    await caseDetailsPage.assertTabData(newUploadApprovedOrderMHTabDataOnHearing1);
    await caseDetailsPage.assertTabData(UploadApprovedOrderCaseDocumentsTabData);
    await caseDetailsPage.assertTabData(UploadApprovedOrderOrdersTabData);
  });
});
