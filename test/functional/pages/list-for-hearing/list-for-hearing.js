async function listForHearing(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'List for Hearing');
  I.wait('2');
  I.click('Go');
  I.waitForText('List for Hearing', '30');
  I.waitForElement('select[id="hearingType"]', '15');
  I.selectOption('select[id="hearingType"]', { label: 'Final Hearing (FH)' });
  I.fillField('input[id="timeEstimate"]', '1:30');
  I.fillField('input[id="hearingDate-day"]', '01');
  I.fillField('input[id="hearingDate-month"]', '02');
  I.fillField('input[id="hearingDate-year"]', '2023');
  I.fillField('input[id="hearingTime"]', '11:30');
  I.selectOption('select[id="hearing_regionList"]', 'London');
  I.selectOption('select[id="hearing_londonFRCList"]', 'London FRC');
  I.selectOption('select[id="hearing_cfcCourtList"]', 'THE ROYAL COURT OF JUSTICE');
  I.fillField('input[id="additionalInformationAboutHearing"]', 'This is an additional information');
  I.checkOption('input[id="additionalHearingDocumentsOption_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers');
  I.click('Submit');
  I.waitForText('Ignore Warning and Go', 15);
  I.click('Ignore Warning and Go');
}

module.exports = { listForHearing };