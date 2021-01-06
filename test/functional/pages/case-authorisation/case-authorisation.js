/* eslint-disable no-invalid-this */

function caseSubmitAuthorisation(casetype) {
  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Case Submission');
  I.wait('2');
  I.click('Go');
  I.waitForText('AUTHORISATION', '15');
  I.fillField('input[id="authorisationName"]', 'Viasda');
  if (casetype === 'contested') {
    I.fillField('input[id="solicitorFirm"]', 'Abc Org');
  } else {
    I.fillField('input[id="authorisationFirm"]', 'Abc Org');
  }
  I.fillField('input[id="authorisation2b"]', 'Sol Org reb');
  I.fillField('input[id="authorisation3-day"]', '10');
  I.fillField('input[id="authorisation3-month"]', '8');
  I.fillField('input[id="authorisation3-year"]', '2020');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { caseSubmitAuthorisation };
