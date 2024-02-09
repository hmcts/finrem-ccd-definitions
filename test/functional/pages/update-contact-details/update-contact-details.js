async function updateContactDetails() {
  const I = this;
  I.waitForElement('select[id="next-step"]', '15');
  I.selectOption('select[id="next-step"]', 'Update contact details');
  I.wait('2');
  I.click('Go');
  I.waitForText('Does this update include a change in representation for either party?');
  I.checkOption('input[id="updateIncludesRepresentativeChange_Yes"]');
  I.checkOption('input[id="nocParty-applicant"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  //TODO verify data from previous page
  I.clearField('input[id="applicantSolicitorEmail"]');
  I.fillField('input[id="applicantSolicitorEmail"]', 'fr_applicant_solicitor1@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Applicant’s Details');
  //TODO verify data from previous page
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers');
  //TODO verify amended data
  I.click('Submit');
  I.waitForText('Update contact details');
}

module.exports = { updateContactDetails };