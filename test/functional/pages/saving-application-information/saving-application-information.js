/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function savingApplicationInformation(caseType) {
  const I = this;
  if (caseType === 'consented') {
    I.waitForElement('//a[contains(@href,"mailto")]', '60');
  }

  if (caseType === 'contested') {
    I.waitForText('cfc.fru@justice.gov.uk', '60');
  }

  if (testForAccessibility === 'true') {
    await I.runAccessibilityTest();
  }

  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function finalInformationPage() {
  const I = this;
  I.waitForPage('#confirmation-body h1:nth-of-type(1)', 'Application Complete');

  if (testForAccessibility === 'true') {
    await I.runAccessibilityTest();
  }

  I.waitForText('Case Submission', '10');
  I.click('Close and Return to case details');
}


module.exports = { savingApplicationInformation, finalInformationPage };
