import { test as base } from '@playwright/test';
import { SigninPage } from '../pages/SigninPage';
import { StartPage } from '../pages/create-case/StartPage';
import { CreateCasePage } from '../pages/create-case/CreateCasePage';
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
import { RespondentDetailsPage } from '../pages/create-case/RespondentDetailsPage';
import { CheckYourAnswersPage } from '../pages/CheckYourAnswersPage';

import { CommonActionsHelper } from '../pages/helpers/CommonActionsHelper';
import { SolicitorDetailsHelper } from '../pages/helpers/SolicitorDetailsHelper';


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
  checkYourAnswersPage: CheckYourAnswersPage;
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
  checkYourAnswersPage: async ({ page }, use) => {
    await use(new CheckYourAnswersPage(page));
  }
});
