/* eslint-disable no-invalid-this */

function amendApplicationDetails() {
  const I = this;
  I.waitForElement('.tabs', '30');
  I.selectOption('select[id="next-step"]', 'Amend Application Details');
  I.wait('2');
  I.click('Go');
  I.waitForText('Before You Start', '5');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('SOLICITOR DETAILS', '5');
  I.fillField('input[id="solicitorPhone"]', '07766120000');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('DIVORCE DETAILS', '5');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D84321');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'RESPONDENT DETAILS');
  I.fillField('input[id="rSolicitorEmail"]', 'mahsol@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'NATURE OF THE APPLICATION');
  I.checkOption('input[value="Property Adjustment Order"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'ORDER FOR CHILDREN');
  I.checkOption('input[id="orderForChildrenQuestion1-No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'D81');
  I.checkOption('input[id="d81Question-No"]');
  I.wait('2');
  I.attachFile('input[id="d81Applicant"]', '../data/fileupload.txt');
  I.wait('2');
  I.attachFile('input[id="d81Respondent"]', '../data/fileupload.txt');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'PENSION DOCUMENTS');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'OTHER DOCUMENTS');

  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('#createCasePreConfirmationInfoText h1', 'Saving your application');

  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('.check-your-answers h2', 'Check your answers');
  I.see('SOLICITOR DETAILS');
  I.see('DIVORCE DETAILS');
  I.see('APPLICANT DETAILS');
  I.see('RESPONDENT DETAILS');
  I.click('Submit');
  I.waitForPage('h2', 'History');
  I.see('Amend Application Details');
  I.selectOption('select[id="next-step"]', 'Case Submission');
  I.wait('2');
  I.click('Go');
}

module.exports = { amendApplicationDetails };