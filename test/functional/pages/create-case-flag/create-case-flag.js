const assert = require('assert');

async function createCaseFlag(){
  const I = this;

  I.selectOption('select[id="next-step"]', 'Create Flag');
  I.click('Go');
  I.waitForText('Create a case flag', '30');
  I.checkOption('input[id="flag-location-1"]');
  I.click('Next');
  I.waitForElement('input[id="flag-type-2"]', 2);
  I.checkOption('input[id="flag-type-2"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  //Validate error message
  I.waitForText('There is a problem');
  I.see('Please select Next to complete the creation of the case flag');
  I.click('Next');

  I.waitForText('Add comments for this flag');
  I.fillField('Add comments for this flag', 'this is comment');
  I.click('Next');
  I.waitForText('Submit');
  I.click('Submit');
}

async function validateCaseFlagAlertMessage(){
  const I = this;
  I.see('There is 1 active flag on this case.');
  I.see('View case flags');

  //click tab using case flag link
  I.clickLink('View case flags');
  I.waitForText('Case flags');
}

async function validateCaseFlagTab(flagStatus) {
  const I = this;
  I.see('Vulnerable user');
  I.see('this is comment');
  const actualFlagStatus = I.grabTextFrom('//*[@id="case-viewer-field-read--flagLauncher"]/span/ccd-field-read/div/ccd-field-read-label/div/ccd-read-case-flag-field/div[1]/ccd-case-flag-table/table/tbody[2]/tr/td[5]/strong');
  if (flagStatus.ignoreCase=== 'Active') {
    assert(actualFlagStatus, flagStatus);
  } else {
    //Inactive
    assert(actualFlagStatus, flagStatus);
  }
  I.see('Case level flags');
}



module.exports = { createCaseFlag, validateCaseFlagAlertMessage, validateCaseFlagTab };