async function uploadOrder(){

  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Upload Order');
  I.wait('2');
  I.click('Go');
  I.waitForText('Upload Approved Order', '30');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Next Hearing Details', '30');
  I.click('Add new');
  I.checkOption('input[id="directionDetailsCollection_0_isAnotherHearingYN_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Event summary');
  I.click('Submit');
  I.waitForText('Upload Order', '60');
}

module.exports = { uploadOrder };