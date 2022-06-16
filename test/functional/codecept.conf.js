exports.config = {
  tests: './*_test.js',
  output: './output/XUI',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
        smartWait: 50000,
        waitForTimeout: 90000,
      show: false,
      waitForNavigation: 'domcontentloaded',
        restart: true,
        keepCookies: false,
        keepBrowserState: false,
      headless: true,
      ignoreHTTPSErrors: true,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            '--smartwait',
            '--window-size=1440,1400',
            '--disable-gpu'

        ]
      }
    },
    PuppeteerHelper: { require: '../helpers/PuppeteerHelper.js' }
  },
    plugins: {
        retryFailedStep: {
            enabled: true
        },
        autoDelay: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: 'true'
        }
    },
  include: { I: './steps_file.js' },
  bootstrap: null,
    multiple: {
        'parallel': {
            'chunks': 2
        }
    },
  mocha: {
    reporterOptions:
      {
        reportDir: './functional-output/xui',
          reportName: 'FinRemTests',
        inlineAssets: true
      }
  },
  name: 'finrem-ccd-definitions'
};
