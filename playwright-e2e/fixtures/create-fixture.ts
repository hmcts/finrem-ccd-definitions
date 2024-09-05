import { test as base } from '@playwright/test';
import { CommonComponents } from '../pages/CommonComponents';
import { LoginPage } from '../pages/LoginPage';
import { ManageCasePage } from '../pages/create-case/ManageCasePage';
import { SolicitorDetailsPage } from '../pages/create-case/SolicitorDetailsPage';
import { DivorceDetailsPage } from '../pages/create-case/DivorceDetailsPage';
import { ApplicantDetailsPage } from '../pages/create-case/ApplicantDetailsPage';
import { RespondentRepresentedPage } from '../pages/create-case/RespondentRepresentedPage';
import { NatureOfApplicationPage } from '../pages/create-case/NatureOfApplicationPage';
import { PropertyAdjustmentPage } from '../pages/create-case/PropertyAdjustmentPage';
import { PeriodicalPaymentsPage } from '../pages/create-case/PeriodicalPaymentsPage';
import { WrittenAgreementPage } from '../pages/create-case/WrittenAgreementPage';
import { FastTrackProcedurePage } from '../pages/create-case/FastTrackProcedurePage';
import { FinancialAssetsPage } from '../pages/create-case/FinancialAssetsPage';
import { FinancialRemedyCourtPage } from '../pages/create-case/FinancialRemedyCourtPage';
import { MiamQuestionPage } from '../pages/create-case/MiamQuestionPage';
import { MiamDetailsPage } from '../pages/create-case/MiamDetailsPage';
import { UploadOrderDocumentsPage } from '../pages/create-case/UploadOrderDocumentPage';
import { CaseDetailsPage } from '../pages/CaseDetailsPage';

type CreateFixtures = {
  commonComponents: CommonComponents;
  loginPage: LoginPage;
  manageCasePage: ManageCasePage;
  solicitorDetailsPage: SolicitorDetailsPage;
  divorceDetailsPage: DivorceDetailsPage;
  applicantDetailsPage: ApplicantDetailsPage;
  respondentRepresentedPage: RespondentRepresentedPage;
  natureOfApplicationPage: NatureOfApplicationPage;
  propertyAdjustmentPage: PropertyAdjustmentPage;
  periodicalPaymentsRadio: PeriodicalPaymentsPage;
  writtenAgreementPage: WrittenAgreementPage;
  fastTrackProcedurePage: FastTrackProcedurePage;
  financialAssetsPage: FinancialAssetsPage;
  financialRemedyCourtPage: FinancialRemedyCourtPage;
  miamQuestionPage: MiamQuestionPage;
  miamDetailsPage: MiamDetailsPage;
  uploadOrderDocumentsPage: UploadOrderDocumentsPage;
  caseDetailsPage: CaseDetailsPage;
};

export const test = base.extend<CreateFixtures>({
  commonComponents: async ({ page }, use) => {
    await use(new CommonComponents(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  manageCasePage: async ({ page }, use) => {
    await use(new ManageCasePage(page));
  },
  solicitorDetailsPage: async ({ page }, use) => {
    await use(new SolicitorDetailsPage(page));
  },
  divorceDetailsPage: async ({ page }, use) => {
    await use(new DivorceDetailsPage(page));
  },
  applicantDetailsPage: async ({ page }, use) => {
    await use(new ApplicantDetailsPage(page));
  },
  respondentRepresentedPage: async ({ page }, use) => {
    await use(new RespondentRepresentedPage(page));
  },
  natureOfApplicationPage: async ({ page }, use) => {
    await use(new NatureOfApplicationPage(page));
  },
  propertyAdjustmentPage: async ({ page }, use) => {
    await use(new PropertyAdjustmentPage(page));
  },
  periodicalPaymentsRadio: async ({ page }, use) => {
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
    await use(new MiamDetailsPage(page));
  },
  uploadOrderDocumentsPage: async ({ page }, use) => {
    await use(new UploadOrderDocumentsPage(page));
  },
  caseDetailsPage: async ({ page }, use) => {
    await use(new CaseDetailsPage(page));
  }
});
