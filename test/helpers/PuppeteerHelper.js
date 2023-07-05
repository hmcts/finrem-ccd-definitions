/* eslint-disable */
'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'true';
const { getAccessibilityTestResult } = require('../accessibility/runner');

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

  async waitForNavigationToComplete(locator) {
    const page = this.helpers[helperName].page;
    await page.waitForSelector(locator, {visible: true});
    await page.click(locator);
  }

  async getCaseRef() {
    const page = this.helpers[helperName].page;
    pause();
    const text = await page.$("#undefined");
    const caseRef = text.getText();
    return caseRef;
  }

  async clickTab(tabTitle) {
    const page = this.helpers[helperName].page;
    const tabXPath = `//div[text()='${tabTitle}']`;
    const tabExists = await page.waitForXPath(tabXPath, {timeout: 6000}) ? true : false;
    if (tabExists) {
      const clickableTab = await page.$x(tabXPath);
      await page.evaluate(el => {return el.click();}, clickableTab[0]);
    }
  }
}

module.exports = PuppeteerHelper;