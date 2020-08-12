/* eslint-disable no-invalid-this */

function natureOfApplication() {
  const I = this;
  // I.wait(5);
  I.waitForPage('h4', 'NATURE OF THE APPLICATION');

  I.checkOption('input[value="Periodical Payment Order"]');
  I.checkOption('input[value="Lump Sum Order"]');
  I.checkOption('input[value="Pension Sharing Order"]');
  I.checkOption('input[value="Pension Attachment Order"]');
  I.checkOption('input[value="Pension Compensation Sharing Order"]');
  I.checkOption('input[value="Pension Compensation Attachment Order"]');
  I.checkOption('input[value="A settlement or a transfer of property"]');
  I.checkOption('input[value="Property Adjustment Order"]');
  I.fillField('#natureOfApplication3a', '26 Riverside gardens');
  I.fillField('#natureOfApplication3b', 'Mortgage Account Details');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { natureOfApplication };