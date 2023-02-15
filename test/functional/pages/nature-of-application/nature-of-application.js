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
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedNatureOfApplication() {
  const I = this;

  await I.waitForPage('input[value="periodicalPaymentOrder"]');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.checkOption('input[value="Maintenance Pending Suit"]');
  I.checkOption('input[value="propertyAdjustmentOrder"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForElement('#propertyAddress', 60);
  I.fillField('#propertyAddress', '26 Riverside gardens, SW10XE');
  I.fillField('#mortgageDetail', 'Halifax mortgage');
  I.checkOption('input[id="additionalPropertyOrderDecision_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedNatureOfApplicationForSchedule1(){
  const I = this;

  await I.waitForText('What is the nature of the application ?');
  I.checkOption('input[id="natureOfApplicationChecklistSchedule-Interim child periodical payments"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}
module.exports = { natureOfApplication, contestedNatureOfApplication, contestedNatureOfApplicationForSchedule1 };
