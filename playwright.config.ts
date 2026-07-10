import { CommonConfig, ProjectsConfig } from "@hmcts/playwright-common";
import { defineConfig } from "@playwright/test";

const zapProxyUrl = process.env.ZAP_PROXY_URL;

export default defineConfig({
  ...CommonConfig.recommended,
  testDir: "./playwright-e2e",
  testMatch: "*spec.ts",
  snapshotDir: "./playwright-e2e/snapshots",
  retries: process.env.CI ? 3 : 3,
  workers: Number(process.env.FUNCTIONAL_TESTS_WORKERS || 4),
  expect: { timeout: 180_000 },
  timeout: 5 * 60 * 1000,
  globalTeardown: "./playwright-e2e/config/global-teardown",

  projects: [
    {
      ...ProjectsConfig.chrome,
    },
    {
      ...ProjectsConfig.chromium,
    },
    {
      name: "zap-chromium",
      use: {
        ...ProjectsConfig.chromium.use,

        // ZAP's generated CA certificate is not trusted by Chromium.
        ignoreHTTPSErrors: true,

        ...(zapProxyUrl
          ? {
              proxy: {
                server: zapProxyUrl,
                bypass: [
                  "localhost",
                  "127.0.0.1",
                  "*.service.core-compute-aat.internal",
                ].join(","),
              },
            }
          : {}),
      },
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
