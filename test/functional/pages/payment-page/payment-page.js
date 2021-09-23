/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function paymentPage(pbaValue) {
  const I = this;
  I.waitForText('PAYMENT DETAILS', '15');
  if(testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  if (pbaValue === false) {
    I.checkOption('input[id="helpWithFeesQuestion_Yes"]');
  } else {
    I.checkOption('input[id="helpWithFeesQuestion-No"]');
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentPage };