/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function caseSubmitAuthorisation(casetype) {
  const I = this;
  await I.waitForPage('select[id="next-step"]');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.selectOption('select[id="next-step"]', 'Case Submission');
  I.wait('2');
  I.click('Go');
  I.waitForText('AUTHORISATION', '90');
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
