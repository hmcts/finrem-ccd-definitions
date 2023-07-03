const assert = require('assert');
async function manageFlags(){
  const I = this;

  I.selectOption('select[id="next-step"]', 'Manage Flags');
  I.click('Go');
  I.waitForText('Manage case flags', '30');
  I.checkOption('input[id="flag-selection-0"]');
  I.click('Next');
  I.waitForText("Update flag \"Vulnerable user\"");

  I.click('Make inactive');
  const flagStatus = I.grabTextFrom('//*[@id="caseEditForm"]/div[4]/ccd-field-write/div/ccd-write-case-flag-field/div/div/ccd-update-flag/div/div[2]/div[1]/p/span/strong');
  assert(flagStatus, 'INACTIVE');
  I.click('Next');
  I.waitForText('Submit');
  I.click('Submit');
  return flagStatus;
}




module.exports = { manageFlags };