/* eslint-disable no-invalid-this */

function checkYourAnswers() {
  const I = this;
  I.waitForElement('.check-your-answers', '60');
  I.see('SOLICITOR DETAILS');
  I.see('DIVORCE DETAILS');
  I.see('APPLICANT DETAILS');
  I.see('RESPONDENT DETAILS');
  I.click('Submit');
}

module.exports = { checkYourAnswers };
