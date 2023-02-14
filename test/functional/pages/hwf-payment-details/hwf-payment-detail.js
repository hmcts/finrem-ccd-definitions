/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function hwfPaymentDetails() {
  const I = this;
  await I.waitForPage('#caseEditForm span.form-label', 'Please enter your Help With Fees reference number');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="HWFNumber"]', 'HWF22345');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { hwfPaymentDetails };