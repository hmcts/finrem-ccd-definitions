/* eslint-disable no-invalid-this */

const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';
const runningEnv = process.env.RUNNING_ENV || 'aat';
const jurisdiction = runningEnv === 'demo'? 'Family Divorce - v104-26.1': 'Family Divorce';

async function createCase(type, event) {
  const I = this;
  I.waitForElement('a[href="/cases/case-filter"]', '60');
  I.click('Create case');
  I.waitForPage('h1', 'Create Case');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForElement('select[id="cc-jurisdiction"]>option:nth-of-type(2)', '60');
  I.selectOption('select[id="cc-jurisdiction"]', jurisdiction);
  I.wait('1');
  I.selectOption('select[id="cc-case-type"]', type);
  I.wait('1');
  I.selectOption('select[id= "cc-event"]', event);
  I.wait('1');
  I.click('Start');
  I.waitForText('Before You Start', '30');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { createCase };