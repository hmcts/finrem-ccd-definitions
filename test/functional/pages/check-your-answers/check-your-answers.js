/* eslint-disable no-invalid-this */

async function checkYourAnswers() {
  const I = this;
  I.waitForElement('.check-your-answers', '60');
  await I.runAccessibilityTest();
  I.see('SOLICITOR DETAILS');
  I.see('DIVORCE DETAILS');
  I.see('APPLICANT DETAILS');
  I.see('RESPONDENT DETAILS');
  I.click('Submit');
}

async function contestedCheckYourAnswers() {
  const I = this;
  I.waitForPage('.check-your-answers');
  await I.runAccessibilityTest();
  I.see('Solicitor Details');
  I.see('Divorce Details');
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Do you want to add additional property ?');
  I.see('Do you want to upload any other documents ?');
  I.click('Submit');
}

module.exports = { checkYourAnswers, contestedCheckYourAnswers };
