import { CommonConfig, ProjectsConfig } from "@hmcts/playwright-common";
import { defineConfig } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright-e2e',
  snapshotDir: "./playwright-e2e/snapshots",
  retries: process.env.CI ? 3 : 3,
  expect: { timeout: 180_000 }, // 3 minutes
  timeout: 5*60*1000, //each test execution time is set to 5 min
  workers: process.env.CI ? 2 : undefined,
  ...CommonConfig.recommended,

  projects: [
    {
      ...ProjectsConfig.chrome,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.chromium,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.edge,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.firefox,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.webkit,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.tabletChrome,
      dependencies: ["setup"],
    },
    {
      ...ProjectsConfig.tabletWebkit,
      dependencies: ["setup"],
    },
  ],
});


// //import { defineConfig, devices } from '@playwright/test';
// //import { CommonConfig, ProjectConfig } from '@hmcts/playwright-common';

// /**
//  * See https://playwright.dev/docs/test-configuration.
//  */
// /*export default defineConfig({
//   testDir: './playwright-e2e',
//   testMatch:'*spec.ts',
//   /* Run tests in files in parallel */
//   fullyParallel: true,
//   timeout: 5*60*1000, //each test execution time is set to 5 min
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   retries: process.env.CI ? 3 : 3,
//   /* Opt out of parallel tests on CI. */
//   workers: process.env.CI ? 2 : undefined,
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   //reporter: process.env.CI
//     //? [['dot'], ['html', { outputFolder: '../test-results/functionalTest' }]]
//     //: [['list'], ['html', { outputFolder: '../test-results/functionalTest' }]],
//   reporter: process.env.CI ? [["html"], ["list"]] : [["list"]],
//   expect: { timeout: 180_000 }, // 3 minutes
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: 'retain-on-failure',
//     video: "retain-on-failure",
//     screenshot: 'only-on-failure',
//     navigationTimeout: 60_000,
//     actionTimeout: 60_000,
//   },

//   /* Configure projects for major browsers */
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },

//     // /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 7'] },
//     // },

//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },
//   ]
// }); 
