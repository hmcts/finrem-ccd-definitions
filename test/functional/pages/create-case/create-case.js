/* eslint-disable no-invalid-this */

function createCase(type, event) {
  const I = this;
  I.waitForElement('a[href="/cases/case-filter"]', '60');
  I.click('Create case');
  I.waitForPage('h1', 'Create Case');
  I.waitForElement('select[id="cc-jurisdiction"]>option:nth-of-type(2)', '60');
  I.selectOption('select[id="cc-jurisdiction"]', 'Family Divorce');
  I.wait('1');
  I.selectOption('select[id="cc-case-type"]', type);
  I.wait('1');
  I.selectOption('select[id= "cc-event"]', event);
  I.click('Start');
  I.waitForPage('h2', 'Before You Start');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { createCase };