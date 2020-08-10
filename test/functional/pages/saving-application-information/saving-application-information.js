/* eslint-disable no-invalid-this */

function savingApplicationInformation() {
  const I = this;
  I.waitForElement('//a[contains(@href,"mailto")]', '60');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { savingApplicationInformation };
