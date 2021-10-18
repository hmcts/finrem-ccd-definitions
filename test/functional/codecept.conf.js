exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: false,
      waitForNavigation: 'domcontentloaded',
      headless: true,
      ignoreHTTPSErrors: true,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox'
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
