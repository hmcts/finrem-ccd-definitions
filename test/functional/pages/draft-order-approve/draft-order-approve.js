async function draftOrderApprove(){

  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Draft Order Approved');
  I.wait('2');
  I.click('Go');
  I.waitForText('Latest Draft Direction Order', '30');
  I.selectOption('#orderApprovedJudgeType', 'His Honour Judge');
  I.fillField('Name of Judge', 'Peter Chapman');
  I.fillField('input[id="orderApprovedDate-day"]', '05');
  I.fillField('input[id="orderApprovedDate-month"]', '07');
  I.fillField('input[id="orderApprovedDate-year"]', '2023');
  I.waitForContinueButtonEnabled();
  I.click('Submit');
  I.waitForText('Event summary');
  I.click('Submit');
  I.waitForText('Draft Order Approved', '60');
}

module.exports = { draftOrderApprove };