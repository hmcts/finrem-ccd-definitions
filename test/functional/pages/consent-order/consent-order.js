/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';


async function consentOrder() {
  const I = this;
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }

  // See DFR-3119/EXUI-1987.  Intermittent EXUI issue means this header is not reliably shown, failing tests.
  // I.waitForPage('h4', 'Consent Order');
  I.waitForPage('span', 'PLEASE NOTE: Pension documents should be uploaded separately on the pension upload page');
  I.attachFile('input[id="consentOrder"]', '../data/dummy.pdf');
  I.wait('8');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.wait('4');
}

module.exports = { consentOrder };
