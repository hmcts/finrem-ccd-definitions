/* eslint-disable no-invalid-this */

async function paymentSubmission() {
  const I = this;
  I.waitForPage('div.order-summary-title', 'Order Summary');
  await I.runAccessibilityTest();
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentSubmission };