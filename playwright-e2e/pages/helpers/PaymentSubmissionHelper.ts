import {YesNoRadioEnum} from "./enums/RadioEnums.ts";
import {CaseEvent} from "../../config/case-data.ts";
import {caseSubmissionTable} from "../../resources/check_your_answer_content/case_submission/caseSubmissionTable.ts";
import {paymentDetailsTabData} from "../../resources/tab_content/payment_details_tabs.ts";
import {CaseDetailsPage} from "../CaseDetailsPage.ts";
import {SolicitorAuthPage} from "../events/application-payment-submission/SolicitorAuthPage.ts";
import {HelpWithFeesPage} from "../events/application-payment-submission/HelpWithFeesPage.ts";
import {PaymentPage} from "../events/application-payment-submission/PaymentPage.ts";
import {OrderSummaryPage} from "../events/application-payment-submission/OrderSummaryPage.ts";
import {CaseSubmissionPage} from "../events/application-payment-submission/CaseSubmissionPage.ts";
import {CheckYourAnswersPage} from "../CheckYourAnswersPage.ts";

export async function applicationCaseSubmission(
    caseDetailsPage: CaseDetailsPage,
    solicitorAuthPage: SolicitorAuthPage,
    helpWithFeesPage: HelpWithFeesPage,
    paymentPage: PaymentPage,
    orderSummaryPage: OrderSummaryPage,
    caseSubmissionPage: CaseSubmissionPage,
    checkYourAnswersPage: CheckYourAnswersPage,
    param: {
        caseEvent: CaseEvent,
        hasHelpWithFees: YesNoRadioEnum,
        pbaNumber: string,
        reference: string,
        amount: string
    },
    orderSummaryTable: string[][] = [
        ['FEE0229', 'Application for a financial order', '£313.00'],
        ['', 'Total', '£313.00']
    ]
) {
    // Application Payment Submission
    await caseDetailsPage.selectNextStep(param.caseEvent);

    await solicitorAuthPage.assertAuthorisationPage();
    await solicitorAuthPage.assertErrorMessageForMandatoryFields();
    await solicitorAuthPage.enterSolicitorDetails("Bilbo Baggins", "Bag End", "Solicitor");
    await solicitorAuthPage.navigateContinue();

    await helpWithFeesPage.assertPaymentDetailsPage();
    await helpWithFeesPage.assertErrorMessageForHelpWithFees();
    await helpWithFeesPage.selectHelpWithFees(param.hasHelpWithFees?? YesNoRadioEnum.NO);
    await helpWithFeesPage.navigateContinue();

    await paymentPage.assertErrorMessageMandatoryFields();
    await paymentPage.assertAmountToPay(param.amount);
    await paymentPage.enterPaymentDetails(param.pbaNumber, param.reference);
    await paymentPage.navigateContinue();

    await orderSummaryPage.assertOrderSummaryPage();
    await orderSummaryPage.assertPaymentDetails("Fee Account", param.pbaNumber, param.reference);
    await orderSummaryPage.assertOrderSummaryTable(orderSummaryTable);
    await orderSummaryPage.navigateContinue();

    await caseSubmissionPage.navigateContinue();
    await checkYourAnswersPage.assertCheckYourAnswersPage(caseSubmissionTable(param.amount));

    await caseSubmissionPage.navigateSubmit();
    await caseSubmissionPage.returnToCaseDetails();
    await caseDetailsPage.checkHasBeenUpdated(param.caseEvent.listItem);

    // Assert Tab Data
    await caseDetailsPage.assertTabData(paymentDetailsTabData(param.hasHelpWithFees?? YesNoRadioEnum.NO, param.pbaNumber, param.reference));
}