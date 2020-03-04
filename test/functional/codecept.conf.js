exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      waitForNavigation: 'networkidle0',
      chrome: { ignoreHTTPSErrors: true }
    }
  },
  include: { I: './steps_file.js' },
  bootstrap: null,
  mocha: {},
  name: 'finrem-ccd-definitions'
};
