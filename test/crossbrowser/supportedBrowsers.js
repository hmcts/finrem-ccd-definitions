const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 10';

const supportedBrowsers = {
  microsoft: {
    ie11: {
      browserName: 'internet explorer',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'IE11_FR_E2E',
        screenResolution: '1400x1050'
      }
    }
  },
  chromeWindows: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': { name: 'WIN_CHROME_LATEST_FR_E2E' }
    }
  },
  chromeMac: {
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': { name: 'MAC_CHROME_LATEST_FR_E2E' }
    }
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'WIN_FIREFOX_LATEST_FR_E2E',
        screenResolution: '1400x1050'
      }
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': { name: 'MAC_FIREFOX_LATEST_FR_E2E' }
    }
  }
};

module.exports = supportedBrowsers;