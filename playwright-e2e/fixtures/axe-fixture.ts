import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {AxeUtils} from "./utils/axe-utils.ts";

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
  axeUtils: AxeUtils;
};

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => {
      return new AxeBuilder({ page }).withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21a',
        'wcag21aa',
        'wcag22a',
        'wcag22aa'
      ]);
    };

    await use(makeAxeBuilder);
  },
  axeUtils: async ({ page }, use) => {
    await use(new AxeUtils(page));
  }
});
export { expect } from '@playwright/test';
