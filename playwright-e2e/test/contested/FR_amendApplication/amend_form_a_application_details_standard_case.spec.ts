import { test} from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import {
    divorceDissolutionDetails
} from "../../../resources/edited_page_content/contested/divorce-dissolution-details.ts";
import {
    applicantDetails,
    solicitorDetailsContent
} from "../../../resources/edited_page_content/contested/applicant-details.ts";
import {
    respondentDetailsContent,
    respondentSolicitorDetailsContent
} from "../../../resources/edited_page_content/contested/respondent-details.ts";
import {
    natureOfApplicationDetails
} from "../../../resources/edited_page_content/contested/nature-of-application-details.ts";
import {
    propertyAdjustmentDetails
} from "../../../resources/edited_page_content/contested/property-adjustment-details.ts";
import {writtenAgreementDetails} from "../../../resources/edited_page_content/contested/written-agreement-details.ts";
import {
    financialAssetsPageDetails
} from "../../../resources/edited_page_content/contested/financial-assets-page-details.ts";
import {miamDetails} from "../../../resources/edited_page_content/contested/miam-details.ts";
import {
    uploadDocumentPageDetails
} from "../../../resources/edited_page_content/contested/upload-document-page-details.ts";
import {
    contestedFormAAmendApplicationDetailsTable
} from "../../../resources/check_your_answer_content/amend_application_details/amendApplicationDetailsTable.ts";
import {
    financialRemedyCourtDetails
} from "../../../resources/edited_page_content/contested/financial-remedy-court-details.ts";
import {applicationCaseSubmission} from "../../../pages/helpers/PaymentSubmissionHelper.ts";
import {YesNoRadioEnum} from "../../../pages/helpers/enums/RadioEnums.ts";
import {solicitor_amend_case_tabs} from "../../../resources/tab_content/contested/solicitor_amend_case_tabs.ts";

test.describe('Contested - Form A - Amend application in Standard case', () => {
    test(
        "Amend Application Details in Standard case - Amend Form A application details",
        { tag: [] },
        async (
            {
                loginPage,
                manageCaseDashboardPage,
                caseDetailsPage,
                amendFormAApplicationDetailsPage,
                solicitorDetailsPage,
                divorceDetailsPage,
                applicantDetailsPage,
                respondentDetailsPage,
                respondentRepresentedPage,
                natureOfApplicationPage,
                propertyAdjustmentPage,
                periodicalPaymentsPage,
                writtenAgreementPage,
                fastTrackProcedurePage,
                financialAssetsPage,
                financialRemedyCourtPage,
                miamQuestionPage,
                miamDetailsPage,
                uploadOrderDocumentsPage,
                createCaseSavingYourAnswersPage,
                checkYourAnswersPage,
                solicitorAuthPage,
                helpWithFeesPage,
                paymentPage,
                orderSummaryPage,
                caseSubmissionPage,
            }
        ) => {
            const caseId = await ContestedCaseFactory.createBaseContestedFormA();
            const url = ContestedEvents.amendFormAApplicationDetails.ccdCallback;

            await manageCaseDashboardPage.visit();
            await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases)
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.amendFormAApplicationDetails)
            // amend application details
            await amendFormAApplicationDetailsPage.assertTitleIsVisible();
            await amendFormAApplicationDetailsPage.navigateContinue(url, 2);
            // solicitor details
            await solicitorDetailsPage.validateFields(solicitorDetailsContent)
            await solicitorDetailsPage.navigateContinue(url, 3);
            // divorce details
            await divorceDetailsPage.validateFields(divorceDissolutionDetails);
            await divorceDetailsPage.navigateContinue(url, 4);
            // applicant details
            await applicantDetailsPage.validateFields(applicantDetails)
            await applicantDetailsPage.navigateContinue(url, 6);
            // respondent details
            await respondentDetailsPage.validateFields(respondentDetailsContent)
            await respondentDetailsPage.navigateContinue(url, 7);
            // respondent solicitor details
            await respondentRepresentedPage.validateFields(respondentSolicitorDetailsContent)
            await respondentRepresentedPage.navigateContinue(url, 8);
            // nature of application
            await natureOfApplicationPage.validateFields([ {
                label: "Maintenance Pending Suit",
                locator: "input[id='natureOfApplicationChecklist-Maintenance Pending Suit']",
                type: "checkbox",
                expectedValue: "Maintenance Pending Suit"
            }]);
            await natureOfApplicationPage.selectNatureOfApplication();
            await natureOfApplicationPage.validateFields(natureOfApplicationDetails);
            await natureOfApplicationPage.navigateContinue(url, 9);
            // property adjustment
            await propertyAdjustmentPage.propertyAdjustmentOrder();
            await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
            await propertyAdjustmentPage.validateFields(propertyAdjustmentDetails);
            await propertyAdjustmentPage.navigateContinue(url, 10);
            // periodical payments
            await periodicalPaymentsPage.selectPeriodicalPaymentsContested(true);
            await periodicalPaymentsPage.validateFields([
                {
                    label: "Does the application contain any periodical payments or secured periodical payments for children ?",
                    locator: '#paymentForChildrenDecision_radio',
                    type: "radio",
                    expectedValue: "Yes"
                }
            ]);
            await periodicalPaymentsPage.navigateContinue(url, 11);
            // written agreement
            await writtenAgreementPage.selectWrittenAgreement(false);
            await writtenAgreementPage.validateFields(writtenAgreementDetails);
            await writtenAgreementPage.navigateContinue(url, 13);
            // fast track procedure
            await  fastTrackProcedurePage.selectFastTrack(false);
            await fastTrackProcedurePage.validateFields([
                {
                    label: "Is the application suitable to be dealt with under the Fast Track Procedure?",
                    type: "radio",
                    locator: '#fastTrackDecision_radio',
                    expectedValue: "No"
                }
            ]);
            await fastTrackProcedurePage.navigateContinue(url, 14);
            // financial assets
            await financialAssetsPage.selectCheckboxByLabel(
                ['Complex asset or income structures','Non-disclosure of assets']
            );
            await financialAssetsPage.validateFields(financialAssetsPageDetails);
            await financialAssetsPage.navigateContinue(url, 15);
            // financial remedy court
            await financialRemedyCourtPage.validateFields(financialRemedyCourtDetails);
            await financialRemedyCourtPage.navigateContinue(url, 18);
            // miam question
            await miamQuestionPage.validateFields([{
                label: "Has the applicant attended a MIAM?",
                locator: '#applicantAttendedMIAM_radio',
                type: "radio",
                expectedValue: "Yes"
            }]);
            await miamQuestionPage.navigateContinue(url, 24);
            // MIAM details
            await miamDetailsPage.validateFields(miamDetails);
            await miamDetailsPage.navigateContinue(url, 25);
            // upload order documents
            await uploadOrderDocumentsPage.uploadVariationOrderDoc();
            await uploadOrderDocumentsPage.selectUploadAdditionalDocs(true);
            await uploadOrderDocumentsPage.uploadOtherDocuments("NoticeOfActing.pdf", "Notice of acting", 0);
            await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(true);
            await uploadOrderDocumentsPage.enterUrgentCaseDetails("Urgent case details");
            await uploadOrderDocumentsPage.validateFields(uploadDocumentPageDetails);
            await uploadOrderDocumentsPage.navigateContinue(url, 26);
            // saving your application page
            await createCaseSavingYourAnswersPage.assertPageHeading("Saving your application");
            await createCaseSavingYourAnswersPage.navigateContinue(url +'/submit');

            //assert check your answers page
            await amendFormAApplicationDetailsPage.assertPageHeading('Amend Application Details');
            await checkYourAnswersPage.assertCheckYourAnswersPage(contestedFormAAmendApplicationDetailsTable);

            await amendFormAApplicationDetailsPage.navigateSubmit();

            const pbaNumber = "PBA0089162";
            const reference = "Reference";
            const hasHelpWithFees = YesNoRadioEnum.NO;

            await applicationCaseSubmission(
                caseDetailsPage,
                solicitorAuthPage,
                helpWithFeesPage,
                paymentPage,
                orderSummaryPage,
                caseSubmissionPage,
                checkYourAnswersPage,
                {
                    caseEvent: ContestedEvents.applicationPaymentSubmission,
                    hasHelpWithFees: hasHelpWithFees,
                    pbaNumber: pbaNumber,
                    reference: reference,
                    amount: "£313.00"
                }
            );

            await caseDetailsPage.assertTabData(solicitor_amend_case_tabs);
        }
    )
}
);
