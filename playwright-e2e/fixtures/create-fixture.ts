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
  }
});
