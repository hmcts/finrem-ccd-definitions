async function sendOrderNew(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Send Order');
  I.wait('2');
  I.click('Go');
  I.waitForText('Select Order/Orders', '30');
  I.checkOption('input[id="ordersToShare_generalOrder.pdf"]');
  I.click('Continue');

  I.waitForText('Who should receive this order?', '30');

  //validate an error message
  I.click('Continue');
  I.see('Who should receive this order? is required');

  I.checkOption('input[id="partiesOnCase_[APPSOLICITOR]"]');
  I.click('Continue');

  I.waitForText('Please upload any additional document (Optional)?', '30');
  I.click('Continue');

  I.waitForText('What state should this case move to:',30);
  I.selectOption('select[id="sendOrderPostStateOption"]', 'Prepare for Hearing');
  I.click('Continue');

  I.waitForText('Check your answers');
  I.see('Select Order/Orders');
  I.see('Orders tab [Lastest general order] - generalOrder.pdf');

  //validate change button takes to order page
  I.clickLink('Change');
  I.see('Select Order/Orders');
  I.click('Continue');
  I.waitForText('Who should receive this order?', '30');
  I.click('Continue');
  I.waitForText('Please upload any additional document (Optional)?', '30');
  I.click('Continue');
  I.see('Prepare for Hearing');
  I.waitForText('Check your answers');
  I.click('Submit');

  I.waitForText('Prepare For Hearing');

}

module.exports = { sendOrderNew };