import { test as base } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { manageCasePage } from '../pages/manageCasePage';
import { formAApplicationPage } from '../pages/formAApplicationPage';

type CreateFixtures = {
  loginPage: loginPage;
  manageCasePage: manageCasePage;
  formAApplicationPage: formAApplicationPage;
};

export const test = base.extend<CreateFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new loginPage(page));
  },
  manageCasePage: async ({ page }, use) => {
    await use(new manageCasePage(page));
  },
  formAApplicationPage: async ({ page }, use) => {
    await use(new formAApplicationPage(page));
  },
});
