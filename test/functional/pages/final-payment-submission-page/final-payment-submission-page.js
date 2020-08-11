/* eslint-disable no-invalid-this */

function finalPaymentSubmissionPage() {
  const I = this;
  I.waitForPage('.check-your-answers h2', 'Check your answers');
  I.see('AUTHORISATION');
  I.see('PAYMENT DETAILS');
  I.click('Submit');
}

module.exports = { finalPaymentSubmissionPage };
