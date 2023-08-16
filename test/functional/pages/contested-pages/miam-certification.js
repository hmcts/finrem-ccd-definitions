/* eslint-disable no-invalid-this */

function miamCertification() {
  const I = this;
  I.waitForText('Mediator Registration Number (URN)');
  I.fillField('#mediatorRegistrationNumber', '765234');
  I.fillField('#familyMediatorServiceName', 'mediator');
  I.fillField('#soleTraderName', 'trading');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { miamCertification };
