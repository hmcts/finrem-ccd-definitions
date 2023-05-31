async function progressToListing(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Progress To Listing');
  I.wait('2');
  I.click('Go');
  I.waitForText('Progress To Listing', '30');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Manual Payment', '60');
}

module.exports = { progressToListing };