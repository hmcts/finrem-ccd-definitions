/* eslint-disable */
'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'true';
const { getAccessibilityTestResult } = require('../accessibility/runner');
const { generateAccessibilityReport } = require('../reporter/customReporter');

const { runAccessibility } = require('../accessibility/runner');

class PuppeteerHelper extends Helper {
  async runAccessibilityTest() {
    if (!testForAccessibility) {
      return;
    }
    const url = await this.helpers[helperName].grabCurrentUrl();
    const { page } = await this.helpers[helperName];
    await runAccessibility(url, page);
  }
  _finishTest() {
    if (!testForAccessibility) {
      return;
    }
    generateAccessibilityReport(getAccessibilityTestResult());
  }

  async delay(time) {
    await new Promise(function (resolve) {
      setTimeout(resolve, time * 1000);
    });
  }

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    await page.waitForSelector(locator, {visible: true});
    await page.click(locator);
  }

  isXuiLink(locator) {
    return locator.indexOf('href') >= 0 || locator.indexOf('navigation') >= 0;
  }

  adjustLocator(locator) {
    return this.isXuiLink(locator) ? locator : `${locator}:enabled`;
  }

  // gets a locator from a locator which may be string or object with css property
  getEnabledCssLocator(locator) {
    if (!locator) {
      return null;
    }
    return typeof locator === 'string' ? this.adjustLocator(locator) : this.adjustLocator(locator.css);
  }

  async clickTab(tabTitle) {
    const helper = this.helpers[helperName];
    const tabXPath = `//div[contains(text(),"${tabTitle}")]`;

    // wait for element defined by XPath appear in page
    await helper.page.waitForXPath(tabXPath);

    // evaluate XPath expression of the target selector (it returns array of ElementHandle)
    const clickableTabs = await helper.page.$x(tabXPath);

    /* eslint-disable no-await-in-loop */
    for (let i=0; i < clickableTabs.length; i++) {
      await helper.page.evaluate(el => el.click(), clickableTabs[i]);
    }
  }
}

module.exports = PuppeteerHelper;