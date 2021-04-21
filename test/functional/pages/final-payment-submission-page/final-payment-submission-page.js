/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function finalPaymentSubmissionPage() {
  const I = this;
  I.waitForPage('.check-your-answers h2', 'Check your answers');
  if(testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.see('AUTHORISATION');
  I.see('PAYMENT DETAILS');
  I.click('Submit');
}

module.exports = { finalPaymentSubmissionPage };
