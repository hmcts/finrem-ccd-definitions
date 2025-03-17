const assert = require('assert');

async function createCaseFlag(){
  const I = this;

  I.selectOption('select[id="next-step"]', 'Create Flag');
  I.click('Go');
  I.waitForText('Create flag', '60');
  I.waitForElement('#flag-location-1', '30');
  I.checkOption('#flag-location-1');
  I.click('Continue');
  I.waitForElement('#flag-type-2', 30);
  I.checkOption('#flag-type-2');
  I.click('Continue');

  I.waitForText('Add comments for this flag');
  I.fillField('Add comments for this flag', 'this is comment');
  I.click('Continue');
  I.waitForText('Submit');
  I.click('Submit');
}

async function validateCaseFlagAlertMessage(){
  const I = this;
  I.see('There is 1 active flag on this case.');
  I.see('View case flags');

  //click tab
  await I.clickTab('Case Flags');
  I.waitForText('Case flags');
}

async function validateCaseFlagTab(flagStatus) {
  const I = this;
  I.see('Vulnerable user');
  I.see('this is comment');
  const actualFlagStatus = I.grabTextFrom('//*[@id="case-viewer-field-read--flagLauncher"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-case-flag-field/div[1]/ccd-case-flag-table/table/tbody[2]/tr/td[5]/strong');
  assert(actualFlagStatus, flagStatus);
  I.see('Case level flags');
}



module.exports = { createCaseFlag, validateCaseFlagAlertMessage, validateCaseFlagTab };