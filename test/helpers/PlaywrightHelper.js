'use strict';

const Helper = codecept_helper;
const helperName = 'Playwright';
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'true';
const { getAccessibilityTestResult } = require('../accessibility/runner');
const { generateAccessibilityReport } = require('../reporter/customReporter');

const { runAccessibility } = require('../accessibility/runner');

class PlaywrightHelper extends Helper {
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

  async clickBrowserBackButton() {
    const page = this.helpers[helperName].page;
    await page.goBack();
  }

  async delay(time) {
    await new Promise((resolve => {
      setTimeout(resolve, time * 1000);
    }));
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

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    if (locator) {
      if (Array.isArray(locator)) {
        for (let i = 0; i < locator.length; i++) {
          await page.waitForSelector(this.getEnabledCssLocator(locator[i]), { visible: true, timeout: 5000 });
          await page.click(locator[i]);
        }
      } else {
        await page.waitForSelector(locator, { visible: true });
        await page.click(locator);
      }
    }
  }

  async clickTab(tabTitle) {
    const helper = this.helpers[helperName];
    const tabXPath = `//div[contains(text(),"${tabTitle}")]`;

    // wait for element defined by XPath appear in page
    await helper.page.waitForSelector(tabXPath);

    // evaluate XPath expression of the target selector (it returns array of ElementHandle)
    const clickableTabs = await helper.page.$$(tabXPath);


    for (let i = 0; i < clickableTabs.length; i++) {
      await helper.page.evaluate(el => {
        return el.click();
      }, clickableTabs[i]);
    }
  }

  replaceAll(string, search, replace) {
    if (!string) {
      return null;
    }
    return string.split(search).join(replace);
  }

  htmlEquals(html1, html2) {
    if ((html1 && !html2) || (html2 && !html1)) {
      return false;
    }
    if (!html1 && !html2) {
      return true;
    }
    return this.replaceAll(this.replaceAll(this.replaceAll(html1, '-c16'), '-c17'), '-c18') ===
        this.replaceAll(this.replaceAll(this.replaceAll(html2, '-c16'), '-c17'), '-c18');
  }

  async navigateToPage(url) {
    await this.amOnPage(url);
    await this.waitForNavigationToComplete();
  }
}

module.exports = PlaywrightHelper;
