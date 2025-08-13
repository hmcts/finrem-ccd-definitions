import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {AxeUtils} from './utils/axe-utils.ts';

type AxeFixture = {
  axeUtils: AxeUtils;
};

export const test = base.extend<AxeFixture>({
  axeUtils: async ({ page }, use, testInfo) => {
    const axeUtils = new AxeUtils(page);
    await use(axeUtils);
    await axeUtils.generateReport(testInfo);
  }
});
export { expect } from '@playwright/test';
