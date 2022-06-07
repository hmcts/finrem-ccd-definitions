exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
        smartWait: 50000,
        waitForTimeout: 90000,
      show: false,
      waitForNavigation: 'domcontentloaded',
      headless: true,
      ignoreHTTPSErrors: true,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--start-fullscreen'
        ]
      }
    },
    PuppeteerHelper: { require: '../helpers/PuppeteerHelper.js' }
  },
    plugins: {
        retryFailedStep: {
            enabled: true,
            retries: 1
        },
        autoDelay: {
            enabled: true
        }
    },
  include: { I: './steps_file.js' },
  bootstrap: null,
  mocha: {
    reporterOptions:
      {
        reportDir: './test/functional/output',
        inlineAssets: true
      }
  },
  name: 'finrem-ccd-definitions'
};
