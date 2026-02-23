import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config.ts';
import { ContestedEvents } from '../../../config/case-data.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import { applicationCaseSubmission, applicationCaseSubmissionHWF } from '../../../pages/helpers/PaymentSubmissionHelper.ts';
import { envTestData } from '../../../data-utils/test_data/EnvTestDataConfig.ts';

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
    // Create form A case
    const caseId = await ContestedCaseFactory.createBaseContestedFormA();

    // Define common test data
    const pbaNumber = envTestData.PBA_NUMBER;
    const reference = 'Reference';
    const hasHelpWithFees = YesNoRadioEnum.NO;
    const amount = '£313.00';
    const feeCode = 'FEE0229';
    const feeType = 'Application for a financial order';

    // Login as solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      config.manageCaseBaseURL,
      config.loginPaths.cases
    );
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
        caseEvent: ContestedEvents.applicationPaymentSubmission,
        hasHelpWithFees: hasHelpWithFees,
        pbaNumber: pbaNumber,
        reference: reference,
        amount: amount,
        feeCode: feeCode,
        feeType: feeType
      }
    );
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
    // Create Schedule 1 case
    const caseId = await ContestedCaseFactory.createSchedule1Case();

    // Define common test data
    const pbaNumber = envTestData.PBA_NUMBER;
    const reference = 'Reference';
    const hasHelpWithFees = YesNoRadioEnum.NO;
    const amount = '£263.00';
    const feeCode = 'FEE0318';
    const feeType = 'Financial provision for children (paragraph 1(1) or (4), 2(1) or (5), 5(6), 6(5), (7) or (8), 8(2), 10(2), 11 or 14(1) of Schedule 1) ';

    // Login as solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.applicant_solicitor.email,
      config.applicant_solicitor.password,
      config.manageCaseBaseURL,
      config.loginPaths.cases
    );
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
        caseEvent: ContestedEvents.applicationPaymentSubmission,
        hasHelpWithFees: hasHelpWithFees,
        pbaNumber: pbaNumber,
        reference: reference,
        amount: amount,
        feeCode: feeCode,
        feeType: feeType
      },
      [
        ['FEE0318', 'Financial provision for children (paragraph 1(1) or (4), 2(1) or (5), 5(6), 6(5), (7) or (8), 8(2), 10(2), 11 or 14(1) of Schedule 1)', '£263.00'],
        ['', 'Total', '£263.00']
      ]
    );
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
    // Create case
    const caseId = await ContestedCaseFactory.createBaseContestedFormA();

    // Define common test data
    const reference = 'Reference';
    const hasHelpWithFees = YesNoRadioEnum.YES;
    const hwfCode = 'HWF123123';
    const amount = '£313.00';
    const feeCode = 'FEE0229';
    const feeType = 'Application for a financial order';

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL, config.loginPaths.cases);
    await manageCaseDashboardPage.navigateToCase(caseId);
    await applicationCaseSubmissionHWF(
      caseDetailsPage,
      solicitorAuthPage,
      helpWithFeesPage,
      orderSummaryPage,
      caseSubmissionPage,
      checkYourAnswersPage,
      {
        caseEvent: ContestedEvents.applicationPaymentSubmission,
        hasHelpWithFees: hasHelpWithFees,
        hwfCode: hwfCode,
        reference: reference,
        amount: amount,
        feeCode: feeCode,
        feeType: feeType
      },
      [
        ['FEE0229', 'Application for a financial order', '£313.00'],
        ['', 'Total', '£313.00']
      ]
    );
  }
);
