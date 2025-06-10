import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ContestedEvents } from '../../config/case-data';
import { paymentDetailsTabData } from '../../data/tab_content/payment_details_tabs';
import { ContestedCaseDataHelper } from '../data-utils/contested/ContestedCaseDataHelper';


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
  }) => {
    // Create form A case
    const caseId = await ContestedCaseDataHelper.createBaseContestedFormA();

    // Define common test data
    const pbaNumber = "PBA0000539";
    const reference = "Reference";
    const hasHelpWithFees = false;

    // Login as solicitor
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Case Submission
    await caseDetailsPage.selectNextStep(ContestedEvents.applicationPaymentSubmission);
    await solicitorAuthPage.enterSolicitorDetails(
      "Bilbo Baggins",
      "Bag End",
      "Solicitor"
    );
    await solicitorAuthPage.navigateContinue();
    await helpWithFeesPage.selectHelpWithFees(hasHelpWithFees);
    await helpWithFeesPage.navigateContinue();
    await paymentPage.enterPaymentDetails(pbaNumber, reference);
    await paymentPage.navigateContinue();
    await orderSummaryPage.navigateContinue();
    await caseSubmissionPage.navigateContinue();
    await caseSubmissionPage.navigateSubmit();
    await caseSubmissionPage.returnToCaseDetails();

    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.applicationPaymentSubmission.listItem);

    // Assert Tab Data
    await caseDetailsPage.assertTabData(paymentDetailsTabData(hasHelpWithFees, pbaNumber, reference));
  }
);
