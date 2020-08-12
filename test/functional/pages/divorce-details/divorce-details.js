/* eslint-disable no-invalid-this */

function divorceDetails() {
  const I = this;
  I.waitForPage('h4', 'DIVORCE DETAILS');

  I.fillField('input[id="divorceCaseNumber"]', 'LV18D81234');
  I.selectOption('select[id="divorceStageReached"]', 'Decree Nisi');
  I.wait('5');
  I.attachFile('input[type="file"]', '../data/fileupload.txt');
  I.wait('5');
  I.fillField('input[id="divorceDecreeNisiDate-day"]', '1');
  I.fillField('input[id="divorceDecreeNisiDate-month"]', '2');
  I.fillField('input[id="divorceDecreeNisiDate-year"]', '2019');
  I.wait('2');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { divorceDetails };