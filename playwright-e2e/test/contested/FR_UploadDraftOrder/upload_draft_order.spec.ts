import {test} from "../../../fixtures/fixtures.ts";
import {ContestedCaseFactory} from "../../../data-utils/factory/contested/ContestedCaseFactory.ts";
import config from "../../../config/config.ts";
import {ContestedEvents} from "../../../config/case-data.ts";
import {YesNoRadioEnum} from "../../../pages/helpers/enums/RadioEnums.ts";
import {
    uploadDraftOrderTable, uploadSuggestedDraftOrderTable
} from "../../../resources/check_your_answer_content/upload_draft_order/uploadDraftOrderTable.ts";
import {
    approved_upload_draft_order_tabs, suggested_draft_order_case_document_tabs,
    upload_draft_order_tabs
} from "../../../resources/tab_content/contested/upload_draft_order_tabs.ts";
import {DateHelper} from "../../../data-utils/DateHelper.ts";
import {approveOrderTable} from "../../../resources/check_your_answer_content/approve_order/approveOrderTable.ts";
import {ContestedEventApi} from "../../../data-utils/api/contested/ContestedEventApi.ts";


test.describe('Contested - Upload Draft Order', () => {
  test(
    'Form A case uploading a Agreed draft order',
    { tag: ['@webkit'] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        uploadDraftOrdersPage,
        checkYourAnswersPage,
        approvedOrderPage,
        axeUtils,
      }
    ) => {
      const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
      let expectedUrl = ContestedEvents.uploadDraftOrders.ccdCallback;
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);

      await caseDetailsPage.selectNextStep(ContestedEvents.uploadDraftOrders);

      await uploadDraftOrdersPage.chooseAnAgreedOrderFollowingAHearing();
      await uploadDraftOrdersPage.navigateContinue(expectedUrl, 3);
      await uploadDraftOrdersPage.assertMandatoryFields();

      await uploadDraftOrdersPage.confirmTheUploadedDocsAreForTheCase();
      await uploadDraftOrdersPage.selectFirstAvailableHearing();
      await uploadDraftOrdersPage.chooseWhetherJudgeForHearingIsKnown(YesNoRadioEnum.NO);
      await uploadDraftOrdersPage.chooseUploadOnBehalfOfApplicant();
      await uploadDraftOrdersPage.chooseThatYouAreUploadingOrders();
      await uploadDraftOrdersPage.chooseThatYouAreUploadingPensionSharingAnnexes();
      await uploadDraftOrdersPage.uploadDraftOrder(caseId);
      await uploadDraftOrdersPage.uploadPensionSharingAnnexes();
      await axeUtils.audit();
      await uploadDraftOrdersPage.navigateContinue('submit');

      await checkYourAnswersPage.assertCheckYourAnswersPage(uploadDraftOrderTable);
      await uploadDraftOrdersPage.navigateSubmit();
      await uploadDraftOrdersPage.closeAndReturnToCaseDetails();
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.uploadDraftOrders.listItem);
      await caseDetailsPage.assertTabData(upload_draft_order_tabs);

        await caseDetailsPage.validateFileTree([
            {
                type: 'folder',
                label: 'Post Hearing Draft Orders',
                children : [
                    {
                        type: 'file',
                        label: 'agreed-draft-order-document.docx',
                        contentSnippets: [
                            `Case Reference: ${caseId}`,
                        ]
                    },
                    {
                        type: 'file',
                        label: 'BagginsFDA.pdf'
                    }
                ]
            }
        ])
      await axeUtils.audit({
        exclude: [
          `#mvZoomBtn`,
          `.document-tree-container__folder[aria-level="1"]:nth-child(2) > div > .document-tree-container__node--document[aria-level="2"]:nth-child(1)`,
          `.document-tree-container__folder[aria-level="1"]:nth-child(2) > div > .document-tree-container__node--document[aria-level="2"]:nth-child(2)`
        ]
      });
      await manageCaseDashboardPage.signOut();

      // log in as judge to approve the orders
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.judge.email, config.judge.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData(upload_draft_order_tabs);

      await caseDetailsPage.selectNextStep(ContestedEvents.approveOrders);
      await approvedOrderPage.assertApproveOrdersPage();

      await approvedOrderPage.verifyApproveOrderDetails(
          {
            order: 'Draft Order',
            hearing: `First Directions Appointment (FDA) on ${DateHelper.getFullDateTwelveWeeksLater()} 10:00`,
            documentName: 'agreed-draft-order-document.docx',
          }, 1
      );

      await approvedOrderPage.verifyApproveOrderDetails(
          {
            order: 'Pension Sharing Annex',
            hearing: `First Directions Appointment (FDA) on ${DateHelper.getFullDateTwelveWeeksLater()} 10:00`,
            documentName: 'BagginsFDA.pdf',
          },2
      );

      await approvedOrderPage.selectIsThisDocumentReadyToBeSealedAndIssued("Yes", 'agreed-draft-order-document.docx');
      await approvedOrderPage.selectIsThisDocumentReadyToBeSealedAndIssued("Yes", 'BagginsFDA.pdf');
      expectedUrl = ContestedEvents.approveOrders.ccdCallback;
      await axeUtils.audit();
      await approvedOrderPage.navigateContinue(expectedUrl, 2);
      await approvedOrderPage.selectIsAnotherHearingListed(false);
      await approvedOrderPage.navigateContinue(expectedUrl, 3);
      await approvedOrderPage.verifyJudgeTitleListOptions();
      await approvedOrderPage.selectJudgeTitle('District Judge');
      await axeUtils.audit();
      await approvedOrderPage.navigateContinue('submit');

      await checkYourAnswersPage.assertCheckYourAnswersPage(approveOrderTable);
      await approvedOrderPage.navigateSubmit();
      await approvedOrderPage.closeAndReturnToCaseDetails();
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.approveOrders.listItem);
      await caseDetailsPage.assertTabData(approved_upload_draft_order_tabs);
      await manageCaseDashboardPage.signOut();

      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
      await manageCaseDashboardPage.navigateToCase(caseId);
      await caseDetailsPage.assertTabData(approved_upload_draft_order_tabs);
    }
  );

    test(
        'Form A case uploading a Suggested draft order',
        { tag: [] },
        async (
            {
                loginPage,
                manageCaseDashboardPage,
                caseDetailsPage,
                uploadDraftOrdersPage,
                checkYourAnswersPage
            }
        ) => {
            const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
            let expectedUrl = ContestedEvents.uploadDraftOrders.ccdCallback;
            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.uploadDraftOrders);

            await uploadDraftOrdersPage.chooseASuggestedDraftOrderPriorToAListedHearing();
            await uploadDraftOrdersPage.navigateContinue(expectedUrl, 2);
            await uploadDraftOrdersPage.assertMandatoryFields(false);

            await uploadDraftOrdersPage.confirmTheUploadedDocsAreForTheCase();
            await uploadDraftOrdersPage.chooseUploadOnBehalfOfApplicant();
            await uploadDraftOrdersPage.chooseThatYouAreUploadingOrders();
            await uploadDraftOrdersPage.chooseThatYouAreUploadingPensionSharingAnnexes();
            await uploadDraftOrdersPage.uploadDraftOrder(caseId);
            await uploadDraftOrdersPage.uploadPensionSharingAnnexes();
            await uploadDraftOrdersPage.navigateContinue('submit');

            await checkYourAnswersPage.assertCheckYourAnswersPage(uploadSuggestedDraftOrderTable);
            await uploadDraftOrdersPage.navigateSubmit();
            await uploadDraftOrdersPage.closeAndReturnToCaseDetails();
            await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.uploadDraftOrders.listItem);
            await caseDetailsPage.assertTabData(suggested_draft_order_case_document_tabs);
            await caseDetailsPage.validateFileTree([
                {
                    type: 'folder',
                    label: 'Hearing Documents',
                    children : [
                        {
                            type: 'folder',
                            label: 'Applicant',
                            children: [
                                {
                                    type: 'folder',
                                    label: 'Pre Hearing Draft Order',
                                    children: [
                                        {
                                            type: 'file',
                                            label: 'agreed-draft-order-document.docx',
                                            contentSnippets: [
                                                `Case Reference: ${caseId}`,
                                            ]
                                        },
                                        {
                                            type: 'file',
                                            label: 'BagginsFDA.pdf'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]);
            await manageCaseDashboardPage.signOut();
        }
    );

    test ('Contested - Upload Draft Order - Verify user confidentiality with hearings', async ({loginPage, manageCaseDashboardPage, caseDetailsPage, uploadDraftOrdersPage}) => {
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
        const hearingDate = await DateHelper.getHearingDateTwelveWeeksLaterInISOFormat();

        await ContestedEventApi.caseWorkerPerformsAddAHearing(caseId, hearingDate, [
          { action: 'delete', key: 'workingHearing.partiesOnCaseMultiSelectList.value' },
          {
            action: 'insert',
            key: 'workingHearing.partiesOnCaseMultiSelectList.value[0]',
            value: {
              code: "[RESPSOLICITOR]",
              label: "Respondent - Smeagol Gollum"
            }
          }
        ]); // Respondent only sent hearing

        await manageCaseDashboardPage.visit();
        await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(ContestedEvents.uploadDraftOrders);

        await uploadDraftOrdersPage.chooseAnAgreedOrderFollowingAHearing();
        await uploadDraftOrdersPage.navigateContinue();

        await uploadDraftOrdersPage.confirmTheUploadedDocsAreForTheCase();

        // Verify that the hearing details are not shown to the user
        await uploadDraftOrdersPage.assertHearingDropdownIsEmpty(); // Hearing dropdown should be empty as the user is not part of the hearing
    });
});
