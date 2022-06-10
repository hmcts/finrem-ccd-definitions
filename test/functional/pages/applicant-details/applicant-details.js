/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function applicantDetails() {
  const I = this;
  I.waitForElement('input[id="applicantFMName"]', '10');
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="applicantFMName"]', 'viv');
  I.fillField('input[id="applicantLName"]', 'frauto');
  I.wait('5');
  I.selectOption('select[id="regionList"]', 'Wales');
  I.selectOption('select[id="walesFRCList"]', 'Swansea FRC');
  I.selectOption('select[id="swanseaCourtList"]', 'PORT TALBOT JUSTICE CENTRE');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedApplicantDetails() {
  const I = this;
    //I.waitForElement('#applicantDetailsLabel', '30');
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.waitForElement('input[id="applicantFMName"]');
  I.fillField('input[id="applicantFMName"]', 'Tik');
  I.fillField('input[id="applicantLName"]', 'Tok');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { applicantDetails, contestedApplicantDetails };
