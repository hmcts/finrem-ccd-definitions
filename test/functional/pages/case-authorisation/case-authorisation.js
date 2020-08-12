/* eslint-disable no-invalid-this */

function consentedAuthorisation() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Case Submission');
  I.wait('2');
  I.click('Go');
  I.waitForText('AUTHORISATION', '5');
  I.fillField('input[id="authorisationName"]', 'Viasda');
  I.fillField('input[id="authorisationFirm"]', 'Abc Org');
  I.fillField('input[id="authorisation2b"]', 'Sol Org reb');
  I.fillField('input[id="authorisation3-day"]', '10');
  I.fillField('input[id="authorisation3-month"]', '8');
  I.fillField('input[id="authorisation3-year"]', '2020');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { consentedAuthorisation };
