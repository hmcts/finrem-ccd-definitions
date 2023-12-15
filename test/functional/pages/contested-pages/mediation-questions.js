/* eslint-disable no-invalid-this */

function mediationQuestion() {
  const I = this;
  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', 10);
  I.checkOption('input[id="applicantAttendedMIAM_Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { mediationQuestion };
