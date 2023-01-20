async function manualPayment(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Manual Payment');
  I.wait('2');
  I.click('Go');
  I.waitForText('Copy of Paper Form A application documents', '30');
  I.click('//*[@id="copyOfPaperFormA"]/div/button');
  I.selectOption('#copyOfPaperFormA_0_typeOfDocument', 'Copy of paper form A');
  I.attachFile('input[type="file"]', '../data/dummy.pdf');
  I.wait('5');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Manual Payment', '60');
}

module.exports = { manualPayment };