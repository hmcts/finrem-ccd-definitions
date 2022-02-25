/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function savingApplicationInformation() {
  const I = this;
  I.waitForText('Email',30)
  //I.waitForElement('//a[contains(@href,"mailto")]', '80');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function finalInformationPage() {
  const I = this;
  I.waitForPage('#confirmation-body h1:nth-of-type(1)', 'Application Complete');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForText('Case Submission', '10');
  I.click('Close and Return to case details');
}

module.exports = { savingApplicationInformation, finalInformationPage };
