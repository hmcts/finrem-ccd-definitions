exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3000',
      show: false,
      waitForNavigation: 'networkidle0',
      chrome: { ignoreHTTPSErrors: true,
        args: [
          '--start-fullscreen',
          '--proxy-server=proxyout.reform.hmcts.net:8080'
        ]}
    }
  },
  include: { I: './steps_file.js' },
  bootstrap: null,
  mocha: {},
  name: 'finrem-ccd-definitions'
};
