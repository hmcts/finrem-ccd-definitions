/* eslint-disable no-console, no-process-env */

const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const conf = require('config');
const browser = 'chrome';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME || conf.saucelabs.username,
  accessKey: process.env.SAUCE_ACCESS_KEY || conf.saucelabs.key,
  tunnelIdentifier: process.env.SAUCE_TUNNEL_IDENTIFIER || conf.saucelabs.tunnelId,
  acceptSslCerts: true,
  tags: ['FinancialRemedy']
};
function merge (intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}
function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(defaultSauceOptions, candidateCapabilities['sauce:options']);
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    WebDriver: {
      url: process.env.CCD_WEB_URL,
      browser,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
    },
    SauceLabsReportingHelper: { require: '../helpers/sauceLabsReportingHelper.js' },
    SauceLabsBrowserHelper: { require: '../helpers/SauceLabsBrowserHelper.js' }
  },
  include: { I: './steps_file.js' },
  mocha: {
    reporterOptions:
      {
        reportDir: './test/functional/output',
        inlineAssets: true
      }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true
    }
  },
  multiple: {
    microsoft: {
      browsers: getBrowserConfig('microsoft')
    },
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    }
  },
  name: 'FR Frontend Tests'
};

exports.config = setupConfig;