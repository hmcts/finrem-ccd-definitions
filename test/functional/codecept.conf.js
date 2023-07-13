exports.config = {
  tests: './*_test.js',
  output: './functional-output/xui',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
        waitForTimeout: 90000,
        getPageTimeout: 90000,
        setDefaultTimeout: 90000,
        smartWait: 90000,
        show: false,
        headless: true,
        waitForNavigation:  ['networkidle2'],
        restart: true,
        keepCookies: false,
        keepBrowserState: false,

      chrome: {
          ignoreHTTPSErrors: true,
          'ignore-certificate-errors': true,
          'defaultViewport': {
              'width': 1280,
              'height': 960
          },
          args: [
              //  '--headless',
              '--disable-gpu',
              '--no-sandbox',
              '--allow-running-insecure-content',
              '--ignore-certificate-errors',
              '--window-size=1440,1400'
          ]}
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
