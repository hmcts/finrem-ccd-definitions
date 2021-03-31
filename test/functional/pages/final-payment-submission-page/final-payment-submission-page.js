/* eslint-disable no-invalid-this */

async function finalPaymentSubmissionPage() {
  const I = this;
  I.waitForPage('.check-your-answers h2', 'Check your answers');
  await I.runAccessibilityTest();
  I.see('AUTHORISATION');
  I.see('PAYMENT DETAILS');
  I.click('Submit');
}

module.exports = { finalPaymentSubmissionPage };
