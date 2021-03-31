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
}

module.exports = PuppeteerHelper;