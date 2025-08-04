import { CommonConfig, ProjectsConfig } from "@hmcts/playwright-common";
import { defineConfig } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...CommonConfig.recommended,
  testDir: './playwright-e2e',
  testMatch:'*spec.ts',
  snapshotDir: "./playwright-e2e/snapshots",
  retries: process.env.CI ? 3 : 3,
  expect: { timeout: 180_000 }, // 3 minutes
  timeout: 5*60*1000, //each test execution time is set to 5 min
  reporter:  [["html"], ["list"]],

  projects: [
    {
      ...ProjectsConfig.chrome,
    },
    {
      ...ProjectsConfig.chromium,
    },
    {
      ...ProjectsConfig.edge,
    },
    {
      ...ProjectsConfig.firefox,
    },
    {
      ...ProjectsConfig.webkit,
    },
    {
      ...ProjectsConfig.tabletChrome,
    },
    {
      ...ProjectsConfig.tabletWebkit,
    },
  ],
});
