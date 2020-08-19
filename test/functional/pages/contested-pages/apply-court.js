/* eslint-disable no-invalid-this */

function applyingToCourt() {
  const I = this;
  I.waitForPage('#chooseCourtLabel');
  I.selectOption('#regionList', 'London');
  I.waitForPage('#londonFRCList');
  I.selectOption('#londonFRCList', 'London FRC');
  I.waitForPage('#cfcCourtList');

  I.selectOption('#cfcCourtList', 'CENTRAL FAMILY COURT');

  I.fillField('#specialAssistanceRequired', 'Not required');
  I.fillField('#specificArrangementsRequired', 'Not required');
  I.click('#isApplicantsHomeCourt-No');

  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { applyingToCourt };
