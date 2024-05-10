/* eslint-disable no-invalid-this */

function complexityList() {
  const I = this;
  I.waitForPage('input[id="addToComplexityListOfCourts-falseNo"]');
  I.checkOption('input[id="addToComplexityListOfCourts-falseNo"]');

  // for (let checkBoxCtr = '1'; checkBoxCtr <= '5'; checkBoxCtr++) {
  //   I.checkOption(`#estimatedAssetsChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  // }
  I.checkOption('input[id="estimatedAssetsChecklistV2-underOneMillionPounds"]');
  I.wait('2');
  I.fillField('#netValueOfHome', '100000');
  I.waitForText('Pre- or post-nuptial agreements','30');
  for (let checkBoxCtr = '1'; checkBoxCtr <= '15'; checkBoxCtr++) {
    I.checkOption(`#potentialAllegationChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.wait('2');
  I.fillField('#detailPotentialAllegation', 'Test allegation');
  I.wait('2');
  I.checkOption('#otherReasonForComplexity_Yes');
  I.waitForText('If yes – please specify','30');
  I.fillField('#otherReasonForComplexityText', 'Test reason for complexity list');


  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { complexityList };
