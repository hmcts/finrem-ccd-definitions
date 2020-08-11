/* eslint-disable no-invalid-this */

function consentOrder() {
  const I = this;
  I.waitForPage('h4', 'CONSENT ORDER');
  I.attachFile('input[id="consentOrder"]', '../data/dummy.pdf');
  I.wait('2');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.wait('4');
}

module.exports = { consentOrder };
