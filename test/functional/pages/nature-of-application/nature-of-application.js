/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function natureOfApplication() {
  const I = this;
  I.waitForPage('h4', 'NATURE OF THE APPLICATION');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.checkOption('input[value="Maintenance Pending Suit"]');
  I.checkOption('input[value="Lump Sum Order"]');
  I.checkOption('input[value="Property Adjustment Order"]');
  I.checkOption('input[value="Pension Sharing Order"]');
  I.checkOption('input[value="Pension Attachment Order"]');
  I.checkOption('input[value="Pension Compensation Sharing Order"]');
  I.checkOption('input[value="Pension Compensation Attachment Order"]');
  I.checkOption('input[value="A settlement or a transfer of property"]');
  I.waitForText('Mortgage details','30');
  I.fillField('#natureOfApplication3a', '26 Riverside gardens');
  I.fillField('#natureOfApplication3b', 'Mortgage Account Details');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedNatureOfApplication() {
  const I = this;
  I.waitForText('What is the nature of the application ?');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.checkOption('input[value="Maintenance Pending Suit"]');
  // I.checkOption('input[value="Lump Sum Order"]');
  // I.checkOption('input[value="propertyAdjustmentOrder"]');
  // I.checkOption('input[value="periodicalPaymentOrder"]');
  // I.checkOption('input[value="Pension Sharing Order"]');
  // I.checkOption('input[value="Pension Attachment Order"]');
  // I.checkOption('input[value="Pension Compensation Sharing Order"]');
  // I.checkOption('input[value="Pension Compensation Attachment Order"]');

  // I.waitForContinueButtonEnabled();
  // I.click('Continue');
  // I.waitForElement('#propertyAddress', '30');
  // I.fillField('#propertyAddress', '26 Riverside gardens, SW10XE');
  // I.fillField('#mortgageDetail', 'Halifax mortgage');
  // I.checkOption('input[id="additionalPropertyOrderDecision_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedNatureOfApplicationForSchedule1(){
  const I = this;

  await I.waitForText('What is the nature of the application ?');
  I.checkOption('input[value="Interim child periodical payments"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { natureOfApplication, contestedNatureOfApplication, contestedNatureOfApplicationForSchedule1 };
