import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';
import {YesNoRadioEnum} from '../../pages/helpers/enums/RadioEnums.ts';
import {applicationCaseSubmission} from '../../pages/helpers/PaymentSubmissionHelper.ts';
import {envTestData} from '../../data-utils/test_data/EnvTestDataConfig.ts';

test(
  'Consented - Application Payment Submission',
  { tag: ['@chromium', '@payment'] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      solicitorAuthPage,
      helpWithFeesPage,
      paymentPage,
      orderSummaryPage,
      caseSubmissionPage,
      checkYourAnswersPage
    }
  ) => {
    // Create case
    const caseId = await ConsentedCaseFactory.createConsentedCase();

    // Define common test data
    const pbaNumber = envTestData.PBA_NUMBER;
    const reference = 'Reference';
    const hasHelpWithFees = YesNoRadioEnum.NO;
    const amount = '£60.00';
    const feeCode = 'FEE0228';
    const feeType = 'Application (without notice)';

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
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
        hasHelpWithFees: hasHelpWithFees,
        pbaNumber: pbaNumber,
        reference: reference,
        amount: amount,
        feeCode: feeCode,
        feeType: feeType
      },
      [
        ['FEE0228', 'Application (without notice)', '£60.00'],
        ['', 'Total', '£60.00']
      ]
    );
  }
);
