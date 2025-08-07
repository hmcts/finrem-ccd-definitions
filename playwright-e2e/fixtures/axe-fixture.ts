import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {AxeUtils} from './utils/axe-utils.ts';

type AxeFixture = {
  axeUtils: AxeUtils;
};

export const test = base.extend<AxeFixture>({
  axeUtils: async ({ page }, use) => {
    await use(new AxeUtils(page));
  }
});
export { expect } from '@playwright/test';
