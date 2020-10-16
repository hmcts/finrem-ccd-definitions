exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: false,
      waitForNavigation: 'networkidle0',
      headless: true,
      ignoreHTTPSErrors: true,
      chrome: {
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--start-fullscreen',
        ]
      }
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
