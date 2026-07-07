import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import { YesNoRadioEnum } from '../../pages/helpers/enums/RadioEnums.ts';
import {
  applicationCaseSubmission,
  applicationCaseSubmissionHWF
} from '../../pages/helpers/PaymentSubmissionHelper.ts';
import { envTestData } from '../../data-utils/test_data/EnvTestDataConfig.ts';
import { ManageCaseDashboardPage } from '../../pages/ManageCaseDashboardPage.ts';
import { SigninPage } from '../../pages/SigninPage.ts';
import {
    APPLICATION_FEE,
    ORDER_SUMMARY
} from './test_data/payment_fees.ts';

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

test(
  'Consented - Case Submission - PBA Payment',
  { tag: ['@chromium', '@payment'] },
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
    const caseId = await test.step('Create consented case', async () => {
      return await ConsentedCaseFactory.createConsentedCase();
    });

    await test.step('Login and open case', async () => {
      await loginAndOpenCase(
        loginPage,
        manageCaseDashboardPage,
        caseId
      );
    });

    await test.step('Submit application using PBA payment', async (): Promise<void> => {
      await applicationCaseSubmission(
        caseDetailsPage,
        solicitorAuthPage,
        helpWithFeesPage,
        paymentPage,
        orderSummaryPage,
        caseSubmissionPage,
        checkYourAnswersPage,
        {
          caseEvent: ConsentedEvents.applicationPaymentSubmission,
          hasHelpWithFees: YesNoRadioEnum.NO,
          pbaNumber: envTestData.PBA_NUMBER,
          reference: REFERENCE,
          amount: APPLICATION_FEE.amount,
          feeCode: APPLICATION_FEE.code,
          feeType: APPLICATION_FEE.type,
          caseType: 'Consented'
        },
        ORDER_SUMMARY
      );
    });
  }
);

test(
  'Consented - Case Submission - HWF Payment',
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
    const caseId = await test.step('Create consented case', async () => {
      return await ConsentedCaseFactory.createConsentedCase();
    });

    await test.step('Login as applicant solicitor and open case', async () => {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        config.applicant_solicitor.email,
        config.applicant_solicitor.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );

      await manageCaseDashboardPage.navigateToCase(caseId);
    });

    await test.step('Submit application using Help With Fees', async () => {
      await applicationCaseSubmissionHWF(
        caseDetailsPage,
        solicitorAuthPage,
        helpWithFeesPage,
        orderSummaryPage,
        caseSubmissionPage,
        checkYourAnswersPage,
        {
          caseEvent: ConsentedEvents.applicationPaymentSubmission,
          hasHelpWithFees: YesNoRadioEnum.YES,
          hwfCode: 'HWF123123',
          reference: REFERENCE,
          amount: APPLICATION_FEE.amount,
          feeCode: APPLICATION_FEE.code,
          feeType: APPLICATION_FEE.type
        },
        ORDER_SUMMARY
      );
    });
  }
);
