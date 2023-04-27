exports.config = {
  tests: './*_test.js',
  output: './functional-output/xui',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
        smartWait: 50000,
        waitForTimeout: 90000,
      show: false,
      windowSize: '1440x700',
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

      //just adding helper class here
    PuppeteerHelper: { require: '../helpers/PuppeteerHelper.js' },
    'JSWait': {
        require: '../helpers/JSWait.js'
    }
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
