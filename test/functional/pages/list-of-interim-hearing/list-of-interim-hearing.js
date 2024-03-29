async function listForInterimHearing() {

  const I = this;
  I.selectOption('select[id="next-step"]', 'List for Interim Hearing');
  I.wait('2');
  I.click('Go');
  I.wait('2');
  I.waitForText('List for Interim Hearing', '30');
  I.click('Add new');
  I.wait('2');
  I.selectOption('select[id="interimHearingsScreenField_0_interimHearingType"]', 'Directions (DIR)');
  I.fillField('input[id="interimHearingsScreenField_0_interimHearingTimeEstimate"]', '10:30');
  I.fillField('input[id="interimHearingDate-day"]', '10');
  I.fillField('input[id="interimHearingDate-month"]', '01');
  I.fillField('input[id="interimHearingDate-year"]', '2022');
  I.fillField('input[id="interimHearingsScreenField_0_interimHearingTime"]', '11:30');
  I.selectOption('select[id="interimHearingsScreenField_0_interim_regionList"]', 'High Court Family Division');
  I.selectOption('select[id="interimHearingsScreenField_0_interim_highCourtFRCList"]', 'High Court Family Division FRC');
  I.selectOption('select[id="interimHearingsScreenField_0_interim_highCourtList"]', 'High Court Family Division');
  I.fillField('input[id="interimHearingsScreenField_0_interimAdditionalInformationAboutHearing"]',
      'This is an additional information');
  I.checkOption('input[id="interimHearingsScreenField_0_interimPromptForAnyDocument_Yes"]');
  I.attachFile('input[type="file"]', '../data/dummy.pdf');
  I.wait('5');
  I.click('Continue');
  I.waitForText('Event summary', '5');
  I.click('Submit');
  I.wait('15');
}

module.exports = { listForInterimHearing };