async function sendOrder(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Send Order');
  I.wait('2');
  I.click('Go');
  I.waitForText('What state should this case move to:', '30');
  I.selectOption('#sendOrderPostStateOption', 'Close');

  I.click('Submit');

  I.waitForText('Event summary');
  I.click('Submit');
  I.waitForText('Close Case', '60');
}

module.exports = { sendOrder };