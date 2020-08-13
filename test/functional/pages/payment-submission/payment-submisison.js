/* eslint-disable no-invalid-this */

function paymentSubmission() {
  const I = this;
  I.waitForPage('div.order-summary-title', 'Order Summary');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { paymentSubmission };