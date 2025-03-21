import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
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
  }
});
export { expect } from '@playwright/test';
