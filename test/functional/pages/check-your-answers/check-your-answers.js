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
  I.see('What type of application is this?');
  I.see('Divorce / Dissolution Details');
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Is the application suitable to be dealt with under the Fast Track Procedure?');
  I.see('Should this application be allocated to the Complexity List of the Financial Remedies Court?');
  I.see('Please state the current estimated assets in this case:');
  I.see('Of the above value, what is the net value of the family home?');
  I.see('Please tick any potential allegations/issues which may arise');
  I.see('Which Financial Remedies Court are you applying to?');
  I.see('Has the applicant attended a Mediation information & Assessment Meeting (MIAM) in the past 4 months?');
  I.see('Enter details of MIAM certification');
  I.see('Do you want to upload any other documents ?');
  I.see('Urgent Case');
  I.wait('2');
  I.retry('2').click('Submit');
  I.wait('30');
}

module.exports = { checkYourAnswers, contestedCheckYourAnswers };
