/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function paymentSubmission() {
  const I = this;
  I.waitForPage('div.order-summary-title', 'Order Summary');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentSubmission };