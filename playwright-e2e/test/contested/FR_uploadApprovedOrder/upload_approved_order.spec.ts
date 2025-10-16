import {test} from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import {ContestedCaseFactory} from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import {ContestedEvents} from '../../../config/case-data.ts';
import {YesNoRadioEnum} from '../../../pages/helpers/enums/RadioEnums.ts';
import {newUploadApprovedOrderMHTabDataOnHearing1} from '../../../resources/tab_content/contested/hearings_tabs.ts';
import {AxeUtils} from "../../../fixtures/utils/axe-utils.ts";
import { UploadApprovedOrderCaseDocumentsTabData } from '../../../resources/tab_content/contested/case_document_tabs.ts';
import { UploadApprovedOrderOrdersTabData } from '../../../resources/tab_content/contested/orders_tab.ts';
import {UploadApprovedOrderMHPage} from "../../../pages/events/upload-approved-order/UploadApprovedOrderMHPage.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";

async function loginAsCaseWorker(caseId: string, manageCaseDashboardPage: any, loginPage: any): Promise<void> {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
}

async function performUploadApprovedOrderFlowMH(
  caseDetailsPage: any,
  uploadApprovedOrderMHPage: UploadApprovedOrderMHPage,
  axeUtils: AxeUtils
): Promise<string> {
  await caseDetailsPage.selectNextStep(ContestedEvents.uploadApprovedOrder);
  await uploadApprovedOrderMHPage.uploadFirstUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderMHPage.uploadSecondUploadApprovedOrder('approvedOrder.pdf');
  await uploadApprovedOrderMHPage.uploadAdditionalAttachment('additionalAttachment.docx');
  await uploadApprovedOrderMHPage.navigateContinue(ContestedEvents.uploadApprovedOrder.ccdCallback, 2);
  await uploadApprovedOrderMHPage.selectJudge('District Judge');
  await uploadApprovedOrderMHPage.enterJudgeName('District Judge Smith');
  await uploadApprovedOrderMHPage.enterCourtOrderDate('01', '01', '2022');
  await axeUtils.audit();
  await uploadApprovedOrderMHPage.navigateContinue(ContestedEvents.uploadApprovedOrder.ccdCallback, 3);
  await uploadApprovedOrderMHPage.selectIsThisFinalOrder(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.selectDoYouWantToAddHearing(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.selectTypeOfHearing('First Directions Appointment (FDA)');
  await uploadApprovedOrderMHPage.enterTimeEstimate('3 hours');
  await uploadApprovedOrderMHPage.enterHearingDate('01', '01', '2025');
  await uploadApprovedOrderMHPage.enterHearingTime('10:00');
  await uploadApprovedOrderMHPage.selectCourtForHearing();
  await uploadApprovedOrderMHPage.selectHearingAttendance('Remote - video call');
  await uploadApprovedOrderMHPage.enterAdditionalInformationAboutHearing('This is a test hearing');
  await uploadApprovedOrderMHPage.selectAdditionalHearingDocument(YesNoRadioEnum.YES);
  await uploadApprovedOrderMHPage.uploadOtherDocuments('OtherDoc.doc');
  await uploadApprovedOrderMHPage.selectSendNoticeOfHearing(YesNoRadioEnum.YES);
  await axeUtils.audit({
    exclude: [
      '#workingHearing_additionalHearingDocs_value'
    ]
    }
  );
  await uploadApprovedOrderMHPage.navigateContinue("submit");
  const date = DateHelper.getUtcDateTimeFormatted();
  // CYA page
  await uploadApprovedOrderMHPage.navigateSubmit();
  return date;
}

test.describe('Contested - Upload Approved Order (caseworker)', () => {
  test('New Upload Approved Order (MH) event with hearing', { tag: [] }, async ({
    loginPage,
    manageCaseDashboardPage,
    caseDetailsPage,
    uploadApprovedOrderMHPage,
    axeUtils,
  }
  ) => {
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
    await ContestedCaseFactory.caseWorkerProgressToGeneralApplicationOutcome(caseId);
    await loginAsCaseWorker(caseId, manageCaseDashboardPage, loginPage);
    await performUploadApprovedOrderFlowMH(caseDetailsPage, uploadApprovedOrderMHPage, uploadApprovedOrderMHPage, axeUtils);
    // Verify data on hearings, case documents and orders tabs
    await caseDetailsPage.assertTabData(newUploadApprovedOrderMHTabDataOnHearing1);
    await caseDetailsPage.assertTabData(UploadApprovedOrderCaseDocumentsTabData);
    await caseDetailsPage.assertTabData(UploadApprovedOrderOrdersTabData);
  });
});
