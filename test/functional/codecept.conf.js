exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: true,
      waitForNavigation: 'domcontentloaded',
      // headless: true,
      ignoreHTTPSErrors: true,
      chrome: {
        ignoreHTTPSErrors: true,
        'defaultViewport': {
          'width': 1280,
          'height': 960
        },
        args: [
          '--no-sandbox',
          '--window-size=1440,1400'
        ]
      }
    },
    PuppeteerHelper: { require: '../helpers/PuppeteerHelper.js' }
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
