/* eslint-disable no-invalid-this */

function assignContestedCase(caseId, respondentEmail) {
  const I = this;
  I.click('Unassigned cases');
  I.wait('30');
  I.click('FinancialRemedyContested');
  I.waitForText('Case Reference', '10');
  I.waitForText('State', '10');
  I.checkOption(`select-${caseId}`);
  I.waitForText('Share case', '5');
  I.click('Share case');
  I.waitForText('Selected cases', '10');
  I.wait('2');
  I.click({ css: '.govuk-input' });
  I.fillField({ css: '.govuk-input' }, 'fr_');
  I.waitForElement({ css: '#mat-option-1 > .mat-option-text' }, '30');
  I.click({ css: '#mat-option-1 > .mat-option-text' });
  I.wait('2');
  I.click('Add');
  I.wait('2');
  I.click('Continue');
  I.waitForText('Check and confirm your selection', '5');
  I.see(respondentEmail);
  I.click('Confirm');
  I.waitForText('Your cases have been updated', '10');
  I.see('If you\'ve shared one or more cases, your colleagues will now be able to access them from their case list.');
}

module.exports = { assignContestedCase };