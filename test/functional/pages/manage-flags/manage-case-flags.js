const assert = require('assert');
async function manageFlags(){
  const I = this;

  I.selectOption('select[id="next-step"]', 'Manage Flags');
  I.click('Go');
  I.waitForText('Manage case flags', '30');
  I.checkOption('#flag-selection-0');
  I.click('Continue');
  //I.waitForText('Update flag "Vulnerable user"', '30');

  I.click('Make inactive');
  const flagStatus = I.grabTextFrom('//*[@id="flag-status-container-v1"]/div[1]/p/span/strong');
  assert(flagStatus, 'INACTIVE');
  I.click('Continue');
  I.waitForText('Submit');
  I.click('Submit');
  return flagStatus;
}




module.exports = { manageFlags };