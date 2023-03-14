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

async function contestedCheckYourAnswers(applicationType) {
  const I = this;
  I.waitForPage('.check-your-answers');
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.see('Solicitor Details');
  if (applicationType== 'Matrimonial'){
    I.see('Divorce / Dissolution Details');
  }
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Do you want to upload any other documents ?');
  if (applicationType== 'Schedule1') {
    I.see('Child(ren) details');
  }
  I.wait('2');
  I.retry('2').click('Submit');
  I.wait('30');

  //TODO validate more questions here
}

async function checkYourAnswersListForHearing() {
  const I = this;
  I.waitForElement('.check-your-answers', '60');
  I.see('Time Estimate');
  I.see('Hearing Date');
  I.see('Hearing Time');
  I.see('Hearing Court');
  I.see('Additional information about the hearing');
  I.see('Do you want to upload any other documents ?');
  I.retry('2').click('Submit');
  I.retry('2').click('Ignore Warning and Go');
  I.wait('30');
}

module.exports = { checkYourAnswers, contestedCheckYourAnswers, checkYourAnswersListForHearing };
