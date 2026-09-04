import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig } from '@playwright/test';

const isNightly = process.env.NIGHTLY_TEST === 'true';

const outputDir =
  process.env.PLAYWRIGHT_OUTPUT_DIR || 'test-results';

const htmlReportDir =
  process.env.PLAYWRIGHT_HTML_REPORT_DIR || 'playwright-report';

export default defineConfig({
  ...CommonConfig.recommended,

  testDir: './playwright-e2e',
  testMatch: '*spec.ts',

  // Temporarily exclude all WA Task tests from nightly runs
  testIgnore: isNightly
    ? ['**/test/consented/WA_Tasks/**']
    : [],

  snapshotDir: './playwright-e2e/snapshots',
  retries: process.env.CI ? 2 : 1,
  workers: Number(process.env.FUNCTIONAL_TESTS_WORKERS || 3),
  expect: {
    timeout: 45_000,
  },
  timeout: 4 * 60 * 1000, 

  // Each parallel Jenkins browser run gets its own results directory.
  // Falls back to the normal test-results directory when running locally.
  outputDir,

  // Each parallel Jenkins browser run gets its own HTML report.
  // Falls back to playwright-report when running locally.
  reporter: [
    ['html', {
      outputFolder: htmlReportDir,
      open: 'never',
    }],
  ],

  globalTeardown: './playwright-e2e/config/global-teardown',

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
