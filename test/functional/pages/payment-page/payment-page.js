/* eslint-disable no-invalid-this */

async function paymentPage(pbaValue) {
  const I = this;
  I.waitForText('PAYMENT DETAILS', '15');
  await I.runAccessibilityTest();
  if (pbaValue === false) {
    I.checkOption('input[id="helpWithFeesQuestion-Yes"]');
  } else {
    I.checkOption('input[id="helpWithFeesQuestion-No"]');
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentPage };