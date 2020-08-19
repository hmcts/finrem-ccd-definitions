/* eslint-disable no-invalid-this */

function mediationQuestion() {
  const I = this;
  I.waitForPage('input[id="applicantAttendedMIAM-Yes"]');
  I.checkOption('input[id="applicantAttendedMIAM-Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { mediationQuestion };
