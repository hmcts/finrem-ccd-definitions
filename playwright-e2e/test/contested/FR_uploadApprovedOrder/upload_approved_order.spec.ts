import {test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import {ContestedEvents} from '../../../config/case-data.ts';
import {YesNoRadioEnum} from '../../../pages/helpers/enums/RadioEnums.ts';
import {newUploadApprovedOrderMHTabDataOnHearing1} from '../../../resources/tab_content/contested/hearings_tabs.ts';
import {AxeUtils} from "../../../fixtures/utils/axe-utils.ts";
import { UploadApprovedOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs.ts';
import { UploadApprovedOrderOrdersTabData } from '../../../resources/tab_content/contested/orders_tab.ts';
import {UploadApprovedOrderPage} from "../../../pages/events/upload-approved-order/UploadApprovedOrderPage.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performUploadApprovedOrderFlowMH(
  caseDetailsPage: any,
  uploadApprovedOrderPage: UploadApprovedOrderPage,
  axeUtils: AxeUtils
): Promise<string> {
  await caseDetailsPage.selectNextStep(ContestedEvents.uploadApprovedOrder);
  await uploadApprovedOrderPage.uploadFirstUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderPage.uploadSecondUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderPage.uploadAdditionalAttachment('additionalAttachment.docx');
  await uploadApprovedOrderPage.navigateContinue(ContestedEvents.uploadApprovedOrder.ccdCallback, 2);
  await uploadApprovedOrderPage.selectJudge('District Judge');
  await uploadApprovedOrderPage.enterJudgeName('District Judge Smith');
  await uploadApprovedOrderPage.enterCourtOrderDate('01', '01', '2022');
  await axeUtils.audit();
  await uploadApprovedOrderPage.navigateContinue(ContestedEvents.uploadApprovedOrder.ccdCallback, 3);
  await uploadApprovedOrderPage.selectIsThisFinalOrder(YesNoRadioEnum.YES);
  await uploadApprovedOrderPage.selectDoYouWantToAddHearing(YesNoRadioEnum.YES);
  await uploadApprovedOrderPage.selectTypeOfHearing('First Directions Appointment (FDA)');
  await uploadApprovedOrderPage.enterTimeEstimate('3 hours');
  await uploadApprovedOrderPage.enterHearingDate('01', '01', '2025');
  await uploadApprovedOrderPage.enterHearingTime('10:00');
  await uploadApprovedOrderPage.selectCourtForHearing();
  await uploadApprovedOrderPage.selectHearingAttendance('Remote - video call');
  await uploadApprovedOrderPage.enterAdditionalInformationAboutHearing('This is a test hearing');
  await uploadApprovedOrderPage.selectAdditionalHearingDocument(YesNoRadioEnum.YES);
  await uploadApprovedOrderPage.uploadOtherDocuments('OtherDoc.doc');
  await uploadApprovedOrderPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
  await axeUtils.audit({
    exclude: [
      '#workingHearing_additionalHearingDocs_value'
    ]
    }
  );
  await uploadApprovedOrderPage.navigateContinue("submit");
  const date = DateHelper.getUtcDateTimeFormatted();
  // CYA page
  await uploadApprovedOrderPage.navigateSubmit();
  return date;
}

test.describe('Contested - Upload Approved Order (caseworker)', () => {
  test('New Upload Approved Order (MH) event with hearing', { tag: [] }, async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    uploadApprovedOrderPage,
    axeUtils,
  }
  ) => {
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
    await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
    await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
    await performUploadApprovedOrderFlowMH(caseDetailsPage, uploadApprovedOrderPage, axeUtils);
    // Verify data on hearings, case documents and orders tabs
    await caseDetailsPage.assertTabData(newUploadApprovedOrderMHTabDataOnHearing1());
    await caseDetailsPage.assertTabData(UploadApprovedOrderCaseDocumentsTabData);
    await caseDetailsPage.assertTabData(UploadApprovedOrderOrdersTabData);
  });
});
