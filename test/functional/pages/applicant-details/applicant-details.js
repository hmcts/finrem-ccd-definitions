/* eslint-disable no-invalid-this */

function applicantDetails() {
  const I = this;
  I.waitForElement('input[id="applicantFMName"]');
  I.fillField('input[id="applicantFMName"]', 'viv');
  I.fillField('input[id="applicantLName"]', 'frauto');
  I.wait('5');
  I.selectOption('select[id="regionList"]', 'Wales');
  I.selectOption('select[id="walesFRCList"]', 'Swansea FRC');
  I.selectOption('select[id="swanseaCourtList"]', 'PORT TALBOT JUSTICE CENTRE');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

function contestedApplicantDetails() {
  const I = this;
  I.waitForElement('#applicantDetailsLabel h2', '30');
  I.waitForElement('input[id="applicantFMName"]');
  I.fillField('input[id="applicantFMName"]', 'Tik');
  I.fillField('input[id="applicantLName"]', 'Tok');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { applicantDetails, contestedApplicantDetails };
