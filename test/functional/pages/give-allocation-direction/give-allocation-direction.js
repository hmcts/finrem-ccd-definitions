
async function giveAllocationDirection() {
  const I = this;
  I.waitForElement('select[id="next-step"]', '30');
  I.selectOption('select[id="next-step"]', 'Give Allocation Directions');
  I.wait('2');
  I.click('Go');
  I.waitForText('The hearing centre for the case is:', 30);
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Should the application be dealt with as a', 5);
  I.checkOption('input[id="applicationAllocatedTo_No"]');
  I.checkOption('input[id="caseAllocatedTo_No"]');
  I.checkOption('input[value="FR_judgeAllocatedList_2"]');
  I.checkOption('input[id="judgeTimeEstimate-standardTime"]');
  I.click('Continue');
  I.wait(2);
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.see('Give Allocation Directions');
}

module.exports = { giveAllocationDirection };