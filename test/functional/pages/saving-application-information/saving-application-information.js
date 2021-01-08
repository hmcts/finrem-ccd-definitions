/* eslint-disable no-invalid-this */

function savingApplicationInformation() {
  const I = this;
  I.waitForElement('//a[contains(@href,"mailto")]', '60');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

function finalInformationPage() {
  const I = this;
  I.waitForPage('#confirmation-body h1:nth-of-type(1)', 'Application Complete');
  I.waitForText('Case Submission', '10');
  I.click('Close and Return to case details');
}

module.exports = { savingApplicationInformation, finalInformationPage };
