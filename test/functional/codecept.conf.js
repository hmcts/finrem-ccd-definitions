exports.config = {
  tests: './consented_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: false,
      waitForNavigation: 'domcontentloaded',
      headless: true,
        keepCookies: false,
        keepBrowserState: false,
        smartWait: 50000,
        waitForTimeout: 90000,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
            '--smartwait',
            '--disable-gpu',
            '--no-sandbox',
            '--allow-running-insecure-content',
            '--ignore-certificate-errors',
            '--window-size=1440,1400'

        ]
      }
    },
    PuppeteerHelper: { require: '../helpers/PuppeteerHelper.js' }
  },
  include: { I: './steps_file.js' },
    autoDelay: {
            enabled: true
        },
  bootstrap: false,
  mocha: {
    reporterOptions:
      {
        reportDir: './test/functional/output',
        inlineAssets: true
      }
  },
    plugins: {
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: true
        },
        retryFailedStep: {
            enabled: true,
            retries: 1
        },
        autoDelay: {
            enabled: true
        }
    },
  name: 'finrem-ccd-definitions'
};
