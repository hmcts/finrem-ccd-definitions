/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function consentOrder() {
  const I = this;
  if(testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForPage('h4', 'CONSENT ORDER');
  I.attachFile('input[id="consentOrder"]', '../data/dummy.pdf');
  I.wait('2');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.wait('4');
}

module.exports = { consentOrder };
