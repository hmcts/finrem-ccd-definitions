import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedEvents} from '../../config/case-data';
import { ContestedCaseFactory } from '../../data-utils/factory/contested/ContestedCaseFactory';
import {YesNoRadioEnum} from "../../pages/helpers/enums/RadioEnums.ts";
import {applicationCaseSubmission} from "../../pages/helpers/PaymentSubmissionHelper.ts";


test(
  'Contested - Case Submission',
  { tag: [] },
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
    const pbaNumber = "PBA0089162";
    const reference = "Reference";
    const hasHelpWithFees = YesNoRadioEnum.NO;

    // Login as solicitor
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
              caseEvent: ContestedEvents.applicationPaymentSubmission,
              hasHelpWithFees: hasHelpWithFees,
              pbaNumber: pbaNumber,
              reference: reference,
              amount: "£313.00"
          }
      );
  }
);
