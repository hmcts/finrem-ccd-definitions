/* eslint-disable no-invalid-this */

function assignContestedCase(caseId, respondentEmail) {
  const I = this;
  I.waitForText('Unassigned cases', '60');
  I.click('Unassigned cases');
  I.wait('30');
  I.click({xpath: '//div[contains(text(),\'FinancialRemedyContested\')]'});
  I.waitForText('Case Reference', '60');
  I.waitForText('State', '10');
  I.click(`input[id="select-${caseId}"]`);
  I.waitForText('Share case', '20');
  I.click('Share case');
  I.waitForText('Selected cases', '20');
  I.wait('2');
  I.click({ css: '.govuk-input' });
  I.wait('2');
  I.fillField({ css: '.govuk-input' }, 'fr_respondent');
  I.waitForElement({ css: '#mat-option-2 > .mat-option-text' }, '50');
  I.click({ css: '#mat-option-2 > .mat-option-text' });
  I.wait('5');
  I.click('Add');
  I.wait('15');
  I.click('Continue');
  I.waitForText('Check and confirm your selection', '30');
  I.see(respondentEmail);
  I.click('Confirm');
  I.waitForText('Your selected cases have been updated', '30');
  I.see('If you\'ve shared one or more cases, your colleagues will now be able to access them from their case list.');
}

module.exports = { assignContestedCase };
