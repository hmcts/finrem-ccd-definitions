/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function applicantDetails() {
  const I = this;
  I.waitForElement('input[id="applicantFMName"]', '30');
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

    I.waitForText('Applicant’s Details')
    I.waitForElement('h2', 'Applicant’s Details');
    I.waitForElement('input[id="applicantFMName"]');

  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  //I.waitForElement('input[id="applicantFMName"]');
  I.fillField('input[id="applicantFMName"]', 'Tik');
  I.fillField('input[id="applicantLName"]', 'Tok');

  I.fillField('#applicantAddress_applicantAddress_postcodeInput', 'LS29 9DR');
  I.click('Find address');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('select[id="applicantAddress_applicantAddress_addressList"]', '27a, Church Street, Ilkley');

  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { applicantDetails, contestedApplicantDetails };
