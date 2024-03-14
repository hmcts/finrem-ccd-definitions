/* eslint-disable no-invalid-this */

function allocateJudge() {
  const I = this;
  I.waitForPage('select[id="next-step"]');
  I.selectOption('select[id="next-step"]', 'Allocate to Judge');
  I.wait('2');
  I.click('Go');
  I.waitForText('Event summary (optional)', 5);
  I.click('Submit');
}

module.exports = { allocateJudge };
