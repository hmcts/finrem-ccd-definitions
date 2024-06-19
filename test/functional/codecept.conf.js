exports.config = {
  tests: './*_test.js',
  output: './functional-output/xui',
  helpers: {
    Playwright: {
      url: "http://localhost:3000",
      headless: true,
      browser: 'chromium',
      waitForAction: 350,
      retries: 5,
      waitForNavigation: 'load',
      ignoreHTTPSErrors: true,
      bypassCSP: true,
      restart: true,
      keepCookies: false,
      keepBrowserState: false,
    },

    PlaywrightHelper: { require: '../helpers/PlaywrightHelper.js' },
      'JSWait': {
          require: '../helpers/JSWait.js'
    }
  },

  plugins: {
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
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
          reportFilename: 'FinRemTests',
        inlineAssets: true
      }
  },
  name: 'finrem-ccd-definitions'
};



