exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: false,
      waitForNavigation: 'load',
      headless: true,
        keepCookies: false,
        keepBrowserState: false,
        smartWait: 50000,
        waitForTimeout: 180000,
        getPageTimeout: 120000,
        defaultViewport:null,

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
    multiple: {
        'parallel': {
            'chunks': 2
        }
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
        multiple: {
            parallel: {
                chunks:2,
                browsers: ['chrome']
            }
        },
        autoDelay: {
            enabled: true,
            delayAfter:300,
            delayBefore:300

        }

    },
  name: 'finrem-ccd-definitions'
};
