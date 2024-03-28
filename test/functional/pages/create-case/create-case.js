/* eslint-disable no-invalid-this */

const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function createCase(type, event) {
  const I = this;
  I.waitForElement('a[href="/cases/case-filter"]', '60');
  I.click('Create case');
  await I.waitForPage('h1', 'Create Case');
  I.waitForElement('select[id="cc-jurisdiction"]>option:nth-of-type(2)', '60');
  I.selectOption('select[id="cc-jurisdiction"]', 'Family Divorce');
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

async function createPaperCase(type, event) {
  const I = this;
  I.waitForElement('a[href="/cases/case-filter"]', '60');
  I.click('Create case');
  await I.waitForPage('h1', 'Create Case');
  I.waitForElement('select[id="cc-jurisdiction"]>option:nth-of-type(2)', '60');
  I.selectOption('select[id="cc-jurisdiction"]', 'Family Divorce');
  I.wait('1');
  I.selectOption('select[id="cc-case-type"]', type);
  I.wait('1');
  I.selectOption('select[id= "cc-event"]', event);
  I.wait('1');
  I.click('Start');
}

module.exports = { createCase, createPaperCase };