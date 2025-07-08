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
import { ChildWrittenAgreementPage } from '../pages/events/create-case/ChildWrittenAgreementPage';
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
import { ExpressCaseEnrolledPage } from '../pages/events/create-case/ExpressCaseEnrolledPage';
import { UpdateContactDetailsPage } from '../pages/events/update-contact-details/UpdateContactDetailsPage';
import { CreateCaseSavingYourAnswersPage } from '../pages/events/create-case/CreateCaseSavingYourAnswersPage';
import { ListForHearingPage } from '../pages/events/list-for-hearing/ListForHearingPage';
import { AmendFormAApplicationDetailsPage } from '../pages/events/amend-application-details/AmendFormAApplicationDetailsPage';
import { ExpressCasePage } from '../pages/events/amend-application-details/ExpressCasePage';
import { ManageExpressCasePage } from '../pages/events/manage-express-case/ManageExpressCasePage';
import { AmendPaperApplicationDetailsPage } from '../pages/events/amend-application-details/AmendPaperApplicationDetailsPage';
import { GiveAllocationDirectionsPage } from '../pages/events/give-allocation-directions/GiveAllocationDirectionPage';
import { AllocationDirectionsCourtSelectionPage } from '../pages/events/give-allocation-directions/AllocationDirectionsCourtSelectionPage';
import { CreateFlagPage } from  '../pages/events/create-flag/CreateFlagPage';
import { ChildrensDetailsPage } from '../pages/events/create-case/ChildrensDetailsPage';
import { CreateGeneralApplicationPage } from '../pages/events/create-general-application/CreateGeneralApplicationPage';
import { ListForInterimHearingPage } from '../pages/events/list-for-interim-hearing/ListForInterimHearingPage';
import { ManageFlagPage } from '../pages/events/manage-flag/ManageFlagPage';
import { GeneralApplicationDirectionsPage } from '../pages/events/general-application-directions/GeneralApplicationDirectionsPage';
import { UploadDraftOrdersPage } from '../pages/events/upload-draft-orders/UploadDraftOrdersPage';
import { ManageHearingPage } from '../pages/events/manage-hearings/ManageHearing';
import { ManageCaseDocumentsPage } from '../pages/events/manage-case-documents/ManageCaseDocumentsPage';
import { CheckYourAnswersPage } from '../pages/CheckYourAnswersPage';
import {AddNotePage} from '../pages/events/add-note/AddNotePage.ts';
import { AllocateToJudgePage } from '../pages/events/allocate-to-judge/AllocateToJudgePage';
import {EventSummaryPage} from '../pages/events/EventSummaryPage.ts';
import {RefundPage} from '../pages/events/refund/RefundPage.ts';
import { ManageBarristerPage } from '../pages/events/manage-barrister/ManageBarristerPage';
import { PrepareForHearingPage } from '../pages/events/prepare-for-hearing/PrepareForHearingPage.ts';
import { CreateGeneralOrderPage } from '../pages/events/create-general-order/CreateGeneralOrderPage.ts';
import { ContestedSendOrderPage } from '../pages/events/send-order/ContestedSendOrderPage.ts';

const commonActionsHelper = new CommonActionsHelper();
const solicitorDetailsHelper = new SolicitorDetailsHelper();

type CreateFixtures = {
  loginPage: SigninPage;
  createCasePage: CreateCasePage;
  startPage: StartPage;
  solicitorDetailsPage: SolicitorDetailsPage;
  divorceDetailsPage: DivorceDetailsPage;
  applicantDetailsPage: ApplicantDetailsPage;
  childrensDetailsPage: ChildrensDetailsPage;
  respondentDetailsPage: RespondentDetailsPage
  respondentRepresentedPage: RespondentRepresentedPage;
  natureOfApplicationPage: NatureOfApplicationPage;
  propertyAdjustmentPage: PropertyAdjustmentPage;
  periodicalPaymentsPage: PeriodicalPaymentsPage;
  writtenAgreementPage: WrittenAgreementPage;
  childWrittenAgreementPage: ChildWrittenAgreementPage;
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
  approveApplicationPage: ApproveApplicationPage;
  sendOrderPage: SendOrderPage;
  expressCaseEnrolledPage: ExpressCaseEnrolledPage;
  updateContactDetailsPage: UpdateContactDetailsPage;
  createCaseSavingYourAnswersPage: CreateCaseSavingYourAnswersPage;
  listForHearingPage: ListForHearingPage;
  amendFormAApplicationDetailsPage: AmendFormAApplicationDetailsPage;
  expressCasePage: ExpressCasePage;
  manageExpressCasePage: ManageExpressCasePage;
  allocationDirectionsCourtSelectionPage: AllocationDirectionsCourtSelectionPage;
  giveAllocationDirectionsPage: GiveAllocationDirectionsPage;
  amendPaperApplicationDetailsPage: AmendPaperApplicationDetailsPage;
  createFlagPage: CreateFlagPage;
  listForInterimHearingPage: ListForInterimHearingPage;
  createGeneralApplicationPage: CreateGeneralApplicationPage;
  manageFlagPage: ManageFlagPage;
  generalApplicationDirectionsPage: GeneralApplicationDirectionsPage;
  uploadDraftOrdersPage: UploadDraftOrdersPage;
  manageCaseDocumentsPage: ManageCaseDocumentsPage;
  manageHearingPage: ManageHearingPage;
  checkYourAnswersPage: CheckYourAnswersPage;
  addNotePage: AddNotePage;
  allocateToJudgePage: AllocateToJudgePage;
  eventSummaryPage: EventSummaryPage;
  refundPage: RefundPage;
  manageBarristerPage: ManageBarristerPage;
  prepareForHearingPage: PrepareForHearingPage;
  createGeneralOrderPage: CreateGeneralOrderPage;
  contestedSendOrderPage: ContestedSendOrderPage;
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
  childrensDetailsPage: async ({ page }, use) => {
    await use(new ChildrensDetailsPage(page, commonActionsHelper));
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
  childWrittenAgreementPage: async ({ page }, use) => {
    await use(new ChildWrittenAgreementPage(page));
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
  expressCaseEnrolledPage: async ({ page }, use) => {
    await use(new ExpressCaseEnrolledPage(page));
  },
  updateContactDetailsPage: async ({ page }, use) => {
    await use(new UpdateContactDetailsPage(page));
  },
  createCaseSavingYourAnswersPage: async ({ page }, use) => {
    await use(new CreateCaseSavingYourAnswersPage(page));
  },
  listForHearingPage: async ({ page }, use) => {
    await use(new ListForHearingPage(page, commonActionsHelper));
  },
  amendFormAApplicationDetailsPage: async ({ page }, use) => {
    await use(new AmendFormAApplicationDetailsPage(page));
  },
  expressCasePage: async ({ page }, use) => {
    await use(new ExpressCasePage(page));
  },
  manageExpressCasePage: async ({ page }, use) => {
    await use(new ManageExpressCasePage(page));
  },
  allocationDirectionsCourtSelectionPage: async ({ page }, use) => {
    await use(new AllocationDirectionsCourtSelectionPage(page));
  }, 
  giveAllocationDirectionsPage: async ({ page }, use) => {
    await use(new GiveAllocationDirectionsPage(page));
  },
  amendPaperApplicationDetailsPage: async ({ page }, use) => {
    await use(new AmendPaperApplicationDetailsPage(page));
  },
  createFlagPage: async ({ page }, use) => {
    await use(new CreateFlagPage(page));
  },
  createGeneralApplicationPage: async ({ page }, use) => {
    await use(new CreateGeneralApplicationPage(page, commonActionsHelper));
  },
  listForInterimHearingPage: async ({ page }, use) => {
    await use(new ListForInterimHearingPage(page, commonActionsHelper));
  },
  manageFlagPage: async ({ page }, use) => {
    await use(new ManageFlagPage(page));
  },
  generalApplicationDirectionsPage: async ({ page }, use) => {
    await use(new GeneralApplicationDirectionsPage(page));
  },
  uploadDraftOrdersPage: async ({ page }, use) => {
    await use(new UploadDraftOrdersPage(page, commonActionsHelper));
  },
  manageCaseDocumentsPage: async ({ page }, use) => {
    await use(new ManageCaseDocumentsPage(page, commonActionsHelper));
  },
  manageHearingPage: async ({ page }, use) => {
    await use(new ManageHearingPage(page, commonActionsHelper));
  },
  checkYourAnswersPage: async ({ page }, use) => {
    await use(new CheckYourAnswersPage(page));
  },
  addNotePage: async ({ page }, use) => {
    await use(new AddNotePage(page));
  },
  allocateToJudgePage: async ({ page }, use) => {
    await use(new AllocateToJudgePage(page));
  },
  eventSummaryPage: async ({ page }, use) => {
    await use(new EventSummaryPage(page));
  },
  refundPage: async ({ page }, use) => {
    await use(new RefundPage(page));
  },
  manageBarristerPage: async ({ page }, use) => {
    await use(new ManageBarristerPage(page));
  },
  prepareForHearingPage: async ({ page }, use) => {
    await use(new PrepareForHearingPage(page));
  },
  createGeneralOrderPage: async ({ page }, use) => {
    await use(new CreateGeneralOrderPage(page));
  },
  contestedSendOrderPage: async ({ page }, use) => {
    await use(new ContestedSendOrderPage(page));
  }
});
