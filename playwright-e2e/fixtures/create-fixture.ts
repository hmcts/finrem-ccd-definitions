import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ManageCasePage } from '../pages/create-case/ManageCasePage';
import { formAApplicationPage } from '../pages/formAApplicationPage';
import { CommonComponents } from '../pages/commonComponents';

type CreateFixtures = {
  loginPage: LoginPage;
  manageCasePage: ManageCasePage;
  commonComponents: CommonComponents;
  formAApplicationPage: formAApplicationPage;
};

export const test = base.extend<CreateFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  manageCasePage: async ({ page }, use) => {
    await use(new ManageCasePage(page));
  },
  commonComponents: async ({ page }, use) => {
    await use(new CommonComponents(page));
  },
  formAApplicationPage: async ({ page }, use) => {
    await use(new formAApplicationPage(page));
  },
});
