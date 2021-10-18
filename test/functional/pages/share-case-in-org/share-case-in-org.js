/* eslint-disable no-invalid-this */
const runningEnv = process.env.RUNNING_ENV;
const email = runningEnv === 'demo'? 'fr_applicant_sol2@sharklasers.com': 'fr_applicant_sol1@sharklasers.com';

function assignContestedShareCase(caseId, solRef) {
  const I = this;
  I.waitForText('Case type', '90');
  I.selectOption('select[id="wb-jurisdiction"]', 'Family Divorce');
  I.selectOption('select[id="wb-case-type"]', 'Contested Financial Remedy');
  I.selectOption('select[id="wb-case-state"]', 'Any');
  I.waitForText('Solicitor Reference', '30');
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
  I.waitForText(email, '15');
  I.click('Confirm');
  I.waitForText('Your cases have been updated', '10');
  I.see('If you\'ve shared one or more cases,');
}

module.exports = { assignContestedShareCase };