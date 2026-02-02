import {YesNoRadioEnum} from './enums/RadioEnums.ts';
import {CaseEvent} from '../../config/case-data.ts';
import {caseSubmissionTable, caseSubmissionTableHWF} from '../../resources/check_your_answer_content/case_submission/caseSubmissionTable.ts';
import {paymentDetailsReviewData, paymentDetailsTabData} from '../../resources/tab_content/payment_details_tabs.ts';
import {CaseDetailsPage} from '../CaseDetailsPage.ts';
import {SolicitorAuthPage} from '../events/application-payment-submission/SolicitorAuthPage.ts';
import {HelpWithFeesPage} from '../events/application-payment-submission/HelpWithFeesPage.ts';
import {PaymentPage} from '../events/application-payment-submission/PaymentPage.ts';
import {OrderSummaryPage} from '../events/application-payment-submission/OrderSummaryPage.ts';
import {CaseSubmissionPage} from '../events/application-payment-submission/CaseSubmissionPage.ts';
import {CheckYourAnswersPage} from '../CheckYourAnswersPage.ts';
import {AxeUtils} from '../../fixtures/utils/axe-utils.ts';
import {TestInfo} from 'playwright/test';
import { DateHelper } from '../../data-utils/DateHelper.ts';

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
        amount: string,
        feeCode: string,
        feeType: string
    },
  orderSummaryTable: string[][] = [
    ['FEE0229', 'Application for a financial order', '£313.00'],
    ['', 'Total', '£313.00']
  ],
  accessibility?: {
        axeUtils: AxeUtils,
        testInfo: TestInfo,
    }
) {
  // Application Payment Submission
  await caseDetailsPage.selectNextStep(param.caseEvent);

  await solicitorAuthPage.assertAuthorisationPage();
  await solicitorAuthPage.assertErrorMessageForMandatoryFields();
  await solicitorAuthPage.enterSolicitorDetails('Bilbo Baggins', 'Bag End', 'Solicitor');
  accessibility?.axeUtils.audit();
  await solicitorAuthPage.navigateContinue();

  await helpWithFeesPage.assertPaymentDetailsPage();
  await helpWithFeesPage.assertErrorMessageForHelpWithFees();
  await helpWithFeesPage.selectHelpWithFees(param.hasHelpWithFees?? YesNoRadioEnum.NO);
  accessibility?.axeUtils.audit();
  await helpWithFeesPage.navigateContinue();

  await paymentPage.assertErrorMessageMandatoryFields();
  await paymentPage.assertAmountToPay(param.amount);
  await paymentPage.enterPaymentDetails(param.pbaNumber, param.reference);
  accessibility?.axeUtils.audit();
  await paymentPage.navigateContinue();

  await orderSummaryPage.assertOrderSummaryPage();
  //await orderSummaryPage.assertPaymentDetails("Fee Account", param.pbaNumber, param.reference);
  await orderSummaryPage.assertOrderSummaryTable(orderSummaryTable);
  accessibility?.axeUtils.audit();
  await orderSummaryPage.navigateContinue();

  await caseSubmissionPage.navigateContinue();
  await checkYourAnswersPage.assertCheckYourAnswersPage(caseSubmissionTable(param.amount));
  const paymentDateAndTime =  await caseSubmissionPage.navigateSubmit();
  await caseSubmissionPage.returnToCaseDetails();
  await caseDetailsPage.checkHasBeenUpdated(param.caseEvent.listItem);

  // Assert Tab Data
  await caseDetailsPage.assertTabData(
    paymentDetailsTabData(
      param.feeCode,
      param.feeType,
      param.amount
    )
  );

  await caseDetailsPage.clickPaymentHistoryReviewLink();

  await caseDetailsPage.assertTabData([
    {
      tabName: 'Payment History',
      tabContent: paymentDetailsReviewData(
        param.amount,
        param.hasHelpWithFees,
        param.feeCode,
        param.pbaNumber,
        param.reference,
        paymentDateAndTime
      )
    }
  ]);
}

export async function applicationCaseSubmissionHWF(
  caseDetailsPage: CaseDetailsPage,
  solicitorAuthPage: SolicitorAuthPage,
  helpWithFeesPage: HelpWithFeesPage,
  orderSummaryPage: OrderSummaryPage,
  caseSubmissionPage: CaseSubmissionPage,
  checkYourAnswersPage: CheckYourAnswersPage,
  param: {
    caseEvent: CaseEvent,
    hasHelpWithFees: YesNoRadioEnum,
    hwfCode: string,
    reference: string,
    amount: string,
    feeCode: string,
    feeType: string
  },
  orderSummaryTable: string[][] = [
    ['FEE0229', 'Application for a financial order', '£313.00'],
    ['', 'Total', '£313.00']
  ],
  accessibility?: {
    axeUtils: AxeUtils,
    testInfo: TestInfo,
  }
) {
  // Application Submission (HWF)
  await caseDetailsPage.selectNextStep(param.caseEvent);

  await solicitorAuthPage.assertAuthorisationPage();
  await solicitorAuthPage.assertErrorMessageForMandatoryFields();
  await solicitorAuthPage.enterSolicitorDetails('Bilbo Baggins', 'Bag End', 'Solicitor');
  accessibility?.axeUtils.audit();
  await solicitorAuthPage.navigateContinue();

  await helpWithFeesPage.assertPaymentDetailsPage();
  await helpWithFeesPage.assertErrorMessageForHelpWithFees();
  await helpWithFeesPage.selectHelpWithFees(param.hasHelpWithFees ?? YesNoRadioEnum.YES);
  accessibility?.axeUtils.audit();
  await helpWithFeesPage.navigateContinue();

  await helpWithFeesPage.enterHwfCode(param.hwfCode);
  accessibility?.axeUtils.audit();
  await helpWithFeesPage.navigateContinue();

  await orderSummaryPage.assertOrderSummaryPage();
  await orderSummaryPage.assertOrderSummaryTable(orderSummaryTable);
  accessibility?.axeUtils.audit();
  await orderSummaryPage.navigateContinue();

  await caseSubmissionPage.navigateContinue();
  await checkYourAnswersPage.assertCheckYourAnswersPage(caseSubmissionTableHWF(param.hwfCode));

  await caseSubmissionPage.navigateSubmit();
  await caseSubmissionPage.returnToCaseDetails();
  await caseDetailsPage.checkHasBeenUpdated(param.caseEvent.listItem);

  // Assert Tab Data
  await caseDetailsPage.assertTabData(
    paymentDetailsTabData(
      param.feeCode,
      param.feeType,
      param.amount,
      param.hwfCode
    )
  );
}
