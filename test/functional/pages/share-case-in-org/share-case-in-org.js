/* eslint-disable no-invalid-this */

function assignContestedShareCase(caseId, solRef) {
  const I = this;
  I.waitForText('Case type', '90');
  I.selectOption('select[id="wb-jurisdiction"]', 'Family Divorce');
  I.selectOption('select[id="wb-case-type"]', 'Contested Financial Remedy');
  I.selectOption('select[id="wb-case-state"]', 'Any');
  I.waitForText('Solicitor Reference', '90');
  I.fillField('input[id="solicitorReference"]', solRef);
  I.click('Apply');
  I.waitForText('Case Reference', '15');
  I.checkOption(`input[id="select-${caseId}"]`);
  I.click('Share Case');
  I.waitForText('Add recipient', '15');
  I.wait('5');
  I.click({ css: '.govuk-input' });
  I.fillField({ css: '.govuk-input' }, 'fr_');
  I.waitForElement({ css: '#mat-option-1 > .mat-option-text' }, '30');
  I.click({ css: '#mat-option-1 > .mat-option-text' });
  I.wait('2');
  I.click('Add');
  I.wait('2');
  I.click('Continue');
  I.waitForText('fr_applicant_sol1@sharklasers.com', '15');
  I.click('Confirm');
  I.waitForText('Your cases have been updated', 30);
  I.see('If you\'ve shared one or more cases,');
}

module.exports = { assignContestedShareCase };
