import { test as base } from '@playwright/test';
import { SigninPage } from '../pages/SigninPage';
import { CommonActionsHelper } from '../pages/helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../pages/helpers/SolicitorDetailsHelper';

import { StartPage } from '../pages/events/create-case/StartPage';
import { CreateCasePage } from '../pages/events/create-case/CreateCasePage';
import { SolicitorDetailsPage } from '../pages/events/create-case/SolicitorDetailsPage';
import { DivorceDetailsPage } from '../pages/events/create-case/DivorceDetailsPage';
import { ApplicantDetailsPage } from '../pages/events/create-case/ApplicantDetailsPage';
import { RespondentRepresentedPage } from '../pages/events/create-case/RespondentRepresentedPage';
import { NatureOfApplicationPage } from '../pages/events/create-case/NatureOfApplicationPage';
import { PropertyAdjustmentPage } from '../pages/events/create-case/PropertyAdjustmentPage';
import { PeriodicalPaymentsPage } from '../pages/events/create-case/PeriodicalPaymentsPage';
import { WrittenAgreementPage } from '../pages/events/create-case/WrittenAgreementPage';
import { FastTrackProcedurePage } from '../pages/events/create-case/FastTrackProcedurePage';
import { FinancialAssetsPage } from '../pages/events/create-case/FinancialAssetsPage';
import { FinancialRemedyCourtPage } from '../pages/events/create-case/FinancialRemedyCourtPage';
import { MiamQuestionPage } from '../pages/events/create-case/MiamQuestionPage';
import { MiamDetailsPage } from '../pages/events/create-case/MiamDetailsPage';
import { UploadOrderDocumentsPage } from '../pages/events/create-case/UploadOrderDocumentPage';
import { CaseDetailsPage } from '../pages/CaseDetailsPage';
import { RespondentDetailsPage } from '../pages/events/create-case/RespondentDetailsPage';
import { CreateCaseCheckYourAnswersPage } from '../pages/events/create-case/CreateCaseCheckYourAnswersPage';
import { ManageCaseDashboardPage } from '../pages/ManageCaseDashboardPage';
import { HwfApplicationAcceptedPage } from '../pages/events/hwf-application-accepted/HwfApplicationAcceptedPage';
import { SendOrderPage } from '../pages/events/send-order/SendOrderPage';
import { IssueApplicationPage } from '../pages/events/issue-application/IssueApplicationPage';
import { ApproveApplicationPage } from '../pages/events/approve-order/ApproveApplicationPage';
import { CaseSubmissionPage } from '../pages/events/application-payment-submission/CaseSubmissionPage';
import { SolicitorAuthPage } from '../pages/events/application-payment-submission/SolicitorAuthPage';
import { HelpWithFeesPage } from '../pages/events/application-payment-submission/HelpWithFeesPage';
import { PaymentPage } from '../pages/events/application-payment-submission/PaymentPage';
import { OrderSummaryPage } from '../pages/events/application-payment-submission/OrderSummaryPage';
import { ManageOrgDashboardPage } from '../pages/ManageOrgDashboardPage';
import { UpdateContactDetailsPage } from '../pages/events/update-contact-details/UpdateContactDetailsPage';
import { CreateCaseSavingYourAnswersPage } from '../pages/events/create-case/CreateCaseSavingYourAnswersPage';

const commonActionsHelper = new CommonActionsHelper();
const solicitorDetailsHelper = new SolicitorDetailsHelper();

type CreateFixtures = {
  loginPage: SigninPage;
  createCasePage: CreateCasePage;
  startPage: StartPage;
  solicitorDetailsPage: SolicitorDetailsPage;
  divorceDetailsPage: DivorceDetailsPage;
  applicantDetailsPage: ApplicantDetailsPage;
  respondentDetailsPage: RespondentDetailsPage
  respondentRepresentedPage: RespondentRepresentedPage;
  natureOfApplicationPage: NatureOfApplicationPage;
  propertyAdjustmentPage: PropertyAdjustmentPage;
  periodicalPaymentsPage: PeriodicalPaymentsPage;
  writtenAgreementPage: WrittenAgreementPage;
  fastTrackProcedurePage: FastTrackProcedurePage;
  financialAssetsPage: FinancialAssetsPage;
  financialRemedyCourtPage: FinancialRemedyCourtPage;
  miamQuestionPage: MiamQuestionPage;
  miamDetailsPage: MiamDetailsPage;
  uploadOrderDocumentsPage: UploadOrderDocumentsPage;
  caseDetailsPage: CaseDetailsPage;
  createCaseCheckYourAnswersPage: CreateCaseCheckYourAnswersPage;
  manageCaseDashboardPage: ManageCaseDashboardPage;
  manageOrgDashboardPage: ManageOrgDashboardPage;
  solicitorAuthPage: SolicitorAuthPage;
  helpWithFeesPage: HelpWithFeesPage;
  paymentPage: PaymentPage;
  orderSummaryPage: OrderSummaryPage;
  caseSubmissionPage: CaseSubmissionPage;
  hwfApplicationAcceptedPage: HwfApplicationAcceptedPage;
  issueApplicationPage: IssueApplicationPage;
  approveApplicationPage: ApproveApplicationPage
  sendOrderPage: SendOrderPage;
  updateContactDetailsPage: UpdateContactDetailsPage;
  createCaseSavingYourAnswersPage: CreateCaseSavingYourAnswersPage;
};

export const test = base.extend<CreateFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new SigninPage(page));
  },
  createCasePage: async ({ page }, use) => {
    await use(new CreateCasePage(page));
  },
  startPage: async ({ page }, use) => {
    await use(new StartPage(page));
  },
  solicitorDetailsPage: async ({ page }, use) => {
    await use(new SolicitorDetailsPage(page, commonActionsHelper, solicitorDetailsHelper));
  },
  divorceDetailsPage: async ({ page }, use) => {
    await use(new DivorceDetailsPage(page, commonActionsHelper));
  },
  applicantDetailsPage: async ({ page }, use) => {
    await use(new ApplicantDetailsPage(page, commonActionsHelper));
  },
  respondentDetailsPage: async ({ page }, use) => {
    await use(new RespondentDetailsPage(page, commonActionsHelper));
  },
  respondentRepresentedPage: async ({ page }, use) => {
    await use(new RespondentRepresentedPage(page, commonActionsHelper, solicitorDetailsHelper));
  },
  natureOfApplicationPage: async ({ page }, use) => {
    await use(new NatureOfApplicationPage(page));
  },
  propertyAdjustmentPage: async ({ page }, use) => {
    await use(new PropertyAdjustmentPage(page));
  },
  periodicalPaymentsPage: async ({ page }, use) => {
    await use(new PeriodicalPaymentsPage(page));
  },
  writtenAgreementPage: async ({ page }, use) => {
    await use(new WrittenAgreementPage(page));
  },
  fastTrackProcedurePage: async ({ page }, use) => {
    await use(new FastTrackProcedurePage(page));
  }, 
  financialAssetsPage: async ({ page }, use) => {
    await use(new FinancialAssetsPage(page));
  },
  financialRemedyCourtPage: async ({ page }, use) => {
    await use(new FinancialRemedyCourtPage(page));
  },
  miamQuestionPage: async ({ page }, use) => {
    await use(new MiamQuestionPage(page));
  },
  miamDetailsPage: async ({ page }, use) => {
    await use(new MiamDetailsPage(page, commonActionsHelper));
  },
  uploadOrderDocumentsPage: async ({ page }, use) => {
    await use(new UploadOrderDocumentsPage(page, commonActionsHelper));
  },
  caseDetailsPage: async ({ page }, use) => {
    await use(new CaseDetailsPage(page));
  },
  createCaseCheckYourAnswersPage: async ({ page }, use) => {
    await use(new CreateCaseCheckYourAnswersPage(page));
  }, 
  manageCaseDashboardPage: async ({ page }, use) => {
    await use(new ManageCaseDashboardPage(page));
  },
  manageOrgDashboardPage: async ({ page }, use) => {
    await use(new ManageOrgDashboardPage(page));
  },
  solicitorAuthPage: async ({ page }, use) => {
    await use(new SolicitorAuthPage(page));
  },
  helpWithFeesPage: async ({ page }, use) => {
    await use(new HelpWithFeesPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  orderSummaryPage: async ({ page }, use) => {
    await use(new OrderSummaryPage(page));
  },
  caseSubmissionPage: async ({ page }, use) => {
    await use(new CaseSubmissionPage(page));
  },
  hwfApplicationAcceptedPage: async ({ page }, use) => {
    await use(new HwfApplicationAcceptedPage(page));
  },
  issueApplicationPage: async ({ page }, use) => {
    await use(new IssueApplicationPage(page));
  },
  approveApplicationPage: async ({ page }, use) => {
    await use(new ApproveApplicationPage(page));
  },
  sendOrderPage: async ({ page }, use) => {
    await use(new SendOrderPage(page));
  },
  updateContactDetailsPage: async ({ page }, use) => {
    await use(new UpdateContactDetailsPage(page));
  },
  createCaseSavingYourAnswersPage: async ({ page }, use) => {
    await use(new CreateCaseSavingYourAnswersPage(page));
  }
});
