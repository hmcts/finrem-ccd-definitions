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
                checkYourAnswersPage
            }
        ) => {
            const caseId = await ContestedCaseFactory.createBaseContestedFormA();

            await manageCaseDashboardPage.visit();
            await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);

            await caseDetailsPage.selectNextStep(ContestedEvents.amendFormAApplicationDetails)
            // amend application details
            await amendFormAApplicationDetailsPage.assertTitleIsVisible();
            await amendFormAApplicationDetailsPage.navigateContinue();
            // solicitor details
            await solicitorDetailsPage.validateFields(solicitorDetailsContent)
            await solicitorDetailsPage.navigateContinue();
            // divorce details
            await divorceDetailsPage.validateFields(divorceDissolutionDetails);
            await divorceDetailsPage.navigateContinue();
            // applicant details
            await applicantDetailsPage.validateFields(applicantDetails)
            await applicantDetailsPage.navigateContinue();
            // respondent details
            await respondentDetailsPage.validateFields(respondentDetailsContent)
            await respondentDetailsPage.navigateContinue();
            // respondent solicitor details
            await respondentRepresentedPage.validateFields(respondentSolicitorDetailsContent)
            await respondentRepresentedPage.navigateContinue();
            // nature of application
            await natureOfApplicationPage.validateFields([ {
                label: "Maintenance Pending Suit",
                locator: "input[id='natureOfApplicationChecklist-Maintenance Pending Suit']",
                type: "checkbox",
                expectedValue: "Maintenance Pending Suit"
            }]);
            await natureOfApplicationPage.selectNatureOfApplication();
            await natureOfApplicationPage.validateFields(natureOfApplicationDetails);
            await natureOfApplicationPage.navigateContinue();
            // property adjustment
            await propertyAdjustmentPage.propertyAdjustmentOrder();
            await propertyAdjustmentPage.addAdditionalPropertyAdjustment(true);
            await propertyAdjustmentPage.validateFields(propertyAdjustmentDetails);
            await propertyAdjustmentPage.navigateContinue();
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
            await periodicalPaymentsPage.navigateContinue();
            // written agreement
            await writtenAgreementPage.selectWrittenAgreement(false);
            await writtenAgreementPage.validateFields(writtenAgreementDetails);
            await writtenAgreementPage.navigateContinue();
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
            await fastTrackProcedurePage.navigateContinue();
            // financial assets
            await financialAssetsPage.selectCheckboxByLabel(
                ['Complex asset or income structures','Non-disclosure of assets']
            );
            await financialAssetsPage.validateFields(financialAssetsPageDetails);
            await financialAssetsPage.navigateContinue();
            // financial remedy court
            await financialRemedyCourtPage.validateFields([
                {
                    label: "Do you consider that the case should be allocated to be heard at High Court Judge level?",
                    locator: '#allocatedToBeHeardAtHighCourtJudgeLevel_radio',
                    type: "radio",
                    expectedValue: "No"
                },
                {
                    label: "Does anyone in this application need assistance or special facilities when attending court?",
                    locator: '#specialAssistanceRequired',
                    type: "input",
                    expectedValue: "N/A"
                },
                {
                    label: "Does anyone in this application need specific arrangements when attending court?",
                    locator: '#specificArrangementsRequired',
                    type: "input",
                    expectedValue: "N/A"
                },
                {
                    label: "Are there any reasons why the case should not proceed in the applicant’s Local Court? If yes, please set out what they are.",
                    locator: '#isApplicantsHomeCourt_radio',
                    type: "radio",
                    expectedValue: "No"
                }
            ]);
            await financialRemedyCourtPage.navigateContinue();
            // miam question
            await miamQuestionPage.validateFields([{
                label: "Has the applicant attended a MIAM?",
                locator: '#applicantAttendedMIAM_radio',
                type: "radio",
                expectedValue: "Yes"
            }]);
            await miamQuestionPage.navigateContinue();
            // MIAM details
            await miamDetailsPage.validateFields(miamDetails);
            await miamDetailsPage.navigateContinue();
            // upload order documents
            await uploadOrderDocumentsPage.uploadVariationOrderDoc();
            await uploadOrderDocumentsPage.selectUploadAdditionalDocs(true);
            await uploadOrderDocumentsPage.uploadOtherDocuments("NoticeOfActing.pdf", "Notice of acting", 0);
            await uploadOrderDocumentsPage.selectUrgentCaseQuestionRadio(true);
            await uploadOrderDocumentsPage.enterUrgentCaseDetails("Urgent case details");
            await uploadOrderDocumentsPage.validateFields(uploadDocumentPageDetails);
            await uploadOrderDocumentsPage.navigateContinue();
            // saving your application page
            await createCaseSavingYourAnswersPage.assertPageHeading("Saving your application");
            await createCaseSavingYourAnswersPage.navigateContinue();

            //assert check your answers page
            await amendFormAApplicationDetailsPage.assertPageHeading('Amend Application Details');
            await checkYourAnswersPage.assertCheckYourAnswersPage(contestedFormAAmendApplicationDetailsTable);

        }
    )
}
);
