import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config.ts';
import { ContestedEvents } from '../../../config/case-data.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import {
    applicationCaseSubmission,
    applicationCaseSubmissionHWF
} from '../../../pages/helpers/PaymentSubmissionHelper.ts';
import { envTestData } from '../../../data-utils/test_data/EnvTestDataConfig.ts';
import { PAYMENT_FEES } from '../test_data/payment_fees.ts';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage.ts';
import { SigninPage } from '../../../pages/SigninPage.ts';

const REFERENCE = 'Reference';

async function loginAndOpenCase(
    loginPage: SigninPage,
    manageCaseDashboardPage: ManageCaseDashboardPage,
    caseId: string
) {
    await manageCaseDashboardPage.visit();

    await loginPage.loginWaitForPath(
        config.applicant_solicitor.email,
        config.applicant_solicitor.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
    );

    await manageCaseDashboardPage.navigateToCase(caseId);
}


function createPaymentData(fee: { amount: string; code: string; type: string; }) {
    return {
        caseEvent: ContestedEvents.applicationPaymentSubmission,
        reference: REFERENCE,
        amount: fee.amount,
        feeCode: fee.code,
        feeType: fee.type
    };
}


test(
    'Contested - Case Submission - PBA Payment Matrimonial',
    { tag: ['@payment'] },
    async ({
               loginPage,
               manageCaseDashboardPage,
               caseDetailsPage,
               solicitorAuthPage,
               helpWithFeesPage,
               paymentPage,
               orderSummaryPage,
               caseSubmissionPage,
               checkYourAnswersPage
           }) => {

        const caseId = await test.step('Create matrimonial Form A case', async () => {
            return await ContestedCaseFactory.createBaseContestedFormA();
        });


        await test.step('Login and open case', async () => {
            await loginAndOpenCase(
                loginPage,
                manageCaseDashboardPage,
                caseId
            );
        });


        await test.step('Submit matrimonial PBA payment', async () => {

            await applicationCaseSubmission(
                caseDetailsPage,
                solicitorAuthPage,
                helpWithFeesPage,
                paymentPage,
                orderSummaryPage,
                caseSubmissionPage,
                checkYourAnswersPage,
                {
                    ...createPaymentData(PAYMENT_FEES.matrimonial),
                    hasHelpWithFees: YesNoRadioEnum.NO,
                    pbaNumber: envTestData.PBA_NUMBER
                },
                [
                    [
                        PAYMENT_FEES.matrimonial.code,
                        PAYMENT_FEES.matrimonial.type,
                        PAYMENT_FEES.matrimonial.amount
                    ],
                    [
                        '',
                        'Total',
                        PAYMENT_FEES.matrimonial.amount
                    ]
                ]
            );

        });

    }
);



test(
    'Contested - Case Submission - PBA Payment Schedule 1 case',
    { tag: ['@payment'] },
    async ({
               loginPage,
               manageCaseDashboardPage,
               caseDetailsPage,
               solicitorAuthPage,
               helpWithFeesPage,
               paymentPage,
               orderSummaryPage,
               caseSubmissionPage,
               checkYourAnswersPage
           }) => {


        const caseId = await test.step('Create Schedule 1 case', async () => {
            return await ContestedCaseFactory.createSchedule1Case();
        });


        await test.step('Login and open case', async () => {

            await loginAndOpenCase(
                loginPage,
                manageCaseDashboardPage,
                caseId
            );

        });


        await test.step('Submit Schedule 1 PBA payment', async () => {


            await applicationCaseSubmission(
                caseDetailsPage,
                solicitorAuthPage,
                helpWithFeesPage,
                paymentPage,
                orderSummaryPage,
                caseSubmissionPage,
                checkYourAnswersPage,
                {
                    ...createPaymentData(PAYMENT_FEES.schedule1),
                    hasHelpWithFees: YesNoRadioEnum.NO,
                    pbaNumber: envTestData.PBA_NUMBER
                },
                [
                    [
                        PAYMENT_FEES.schedule1.code,
                        PAYMENT_FEES.schedule1.type,
                        PAYMENT_FEES.schedule1.amount
                    ],
                    [
                        '',
                        'Total',
                        PAYMENT_FEES.schedule1.amount
                    ]
                ]
            );


        });

    }
);



test(
    'Contested - Case Submission - HWF Payment',
    { tag: ['@payment', '@hwf'] },
    async ({
               loginPage,
               manageCaseDashboardPage,
               caseDetailsPage,
               solicitorAuthPage,
               helpWithFeesPage,
               orderSummaryPage,
               caseSubmissionPage,
               checkYourAnswersPage
           }) => {


        const caseId = await test.step('Create matrimonial Form A case', async () => {
            return await ContestedCaseFactory.createBaseContestedFormA();
        });


        await test.step('Login and open case', async () => {

            await loginAndOpenCase(
                loginPage,
                manageCaseDashboardPage,
                caseId
            );

        });


        await test.step('Submit HWF payment', async () => {


            await applicationCaseSubmissionHWF(
                caseDetailsPage,
                solicitorAuthPage,
                helpWithFeesPage,
                orderSummaryPage,
                caseSubmissionPage,
                checkYourAnswersPage,
                {
                    ...createPaymentData(PAYMENT_FEES.matrimonial),
                    hasHelpWithFees: YesNoRadioEnum.YES,
                    hwfCode: 'HWF123123'
                },
                [
                    [
                        PAYMENT_FEES.matrimonial.code,
                        PAYMENT_FEES.matrimonial.type,
                        PAYMENT_FEES.matrimonial.amount
                    ],
                    [
                        '',
                        'Total',
                        PAYMENT_FEES.matrimonial.amount
                    ]
                ]
            );


        });

    }
);
