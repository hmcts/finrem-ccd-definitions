/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function checkYourAnswers() {
  const I = this;
  I.waitForElement('.check-your-answers', '60');
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.see('SOLICITOR DETAILS');
  I.see('APPLICATION DETAILS');
  I.see('APPLICANT DETAILS');
  I.see('RESPONDENT DETAILS');
  I.wait('2');
  I.retry('2').click('Submit');
  I.wait('30');
}

async function contestedCheckYourAnswers() {
  const I = this;
  I.waitForPage('.check-your-answers');
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.see('Solicitor Details');
  I.see('Divorce / Dissolution Details');
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Do you want to add additional property ?');
  I.see('Do you want to upload any other documents ?');
  I.wait('2');
  I.retry('2').click('Submit');
  I.wait('30');
}

module.exports = { checkYourAnswers, contestedCheckYourAnswers };
