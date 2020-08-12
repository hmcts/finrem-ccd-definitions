/* eslint-disable no-invalid-this */

function paymentPage(pbaValue) {
  const I = this;
  I.waitForText('PAYMENT DETAILS', '5');
  if (pbaValue === false) {
    I.checkOption('input[id="helpWithFeesQuestion-Yes"]');
  } else {
    I.checkOption('input[id="helpWithFeesQuestion-No"]');
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentPage };