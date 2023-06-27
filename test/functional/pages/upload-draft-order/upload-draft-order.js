async function uploadDraftOrder(){

  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Upload Draft Order');
  I.wait('2');
  I.click('Go');
  I.waitForText('Upload Draft Direction Order', '30');
  I.click('Add new');
  I.selectOption('#draftDirectionOrderCollection_0_purposeOfDocument', 'Draft order');
  I.attachFile('input[type="file"]', '../data/dummy.pdf');
  I.wait('5');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('Check your answers');
  I.click('Submit');
  I.waitForText('Upload Draft Order', '60');
}

module.exports = { uploadDraftOrder };