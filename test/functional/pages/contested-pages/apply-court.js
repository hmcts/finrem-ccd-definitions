/* eslint-disable no-invalid-this */

function applyingToCourt() {
  const I = this;
  I.waitForText('Which Financial Remedies Court are you applying to?', 5);
  I.selectOption('#regionList', 'London');
  I.selectOption('#londonFRCList', 'London FRC');
  I.selectOption('#cfcCourtList', 'CENTRAL FAMILY COURT');

  I.click('#allocatedToBeHeardAtHighCourtJudgeLevel_No');
  I.fillField('#specialAssistanceRequired', 'Not required');
  I.fillField('#specificArrangementsRequired', 'Not required');
  I.click('#isApplicantsHomeCourt_No');

  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { applyingToCourt };
