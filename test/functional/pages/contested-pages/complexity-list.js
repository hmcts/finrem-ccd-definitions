/* eslint-disable no-invalid-this */

function complexityList() {
  const I = this;
  I.waitForPage('input[id="addToComplexityListOfCourts-falseNo"]');
  I.checkOption('input[id="addToComplexityListOfCourts-falseNo"]');

  for (let checkBoxCtr = '1'; checkBoxCtr <= '5'; checkBoxCtr++) {
    I.checkOption(`#estimatedAssetsChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }

  I.fillField('#netValueOfHome', '100000');

  for (let checkBoxCtr = '1'; checkBoxCtr <= '15'; checkBoxCtr++) {
    I.checkOption(`#potentialAllegationChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.fillField('#detailPotentialAllegation', 'Test allegation');

  I.checkOption('#otherReasonForComplexity-Yes');
  I.fillField('#otherReasonForComplexityText', 'Test reason for complexity list');


  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { complexityList };
