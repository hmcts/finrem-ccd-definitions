/* eslint-disable no-invalid-this */

function hwfPaymentDetails() {
  const I = this;
  I.waitForPage('#caseEditForm span.form-label', 'Please enter your Help With Fees reference number');
  I.fillField('input[id="HWFNumber"]', 'HWF22345');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { hwfPaymentDetails };