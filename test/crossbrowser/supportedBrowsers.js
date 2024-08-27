const LATEST_MAC = 'macOS 10.15';
const LATEST_WINDOWS = 'Windows 11';

const supportedBrowsers = {
  microsoft: {
    edge: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': { name: 'Edge_Win10' }
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
  firefoxWindows: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': { name: 'WIN_FIREFOX_LATEST_FR_E2E' }
    }
  },
  firefoxMac: {
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': { name: 'MAC_FIREFOX_LATEST_FR_E2E' }
    }
  }
};

module.exports = supportedBrowsers;