/* eslint-disable no-invalid-this */

function amendApplicationDetails() {
  const I = this;
  I.waitForText('History', '30');
  I.selectOption('select[id="next-step"]', 'Amend Application Details');
  I.wait('2');
  I.click('Go');
  I.waitForText('Before You Start', '20');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('SOLICITOR DETAILS', '20');
  I.fillField('input[id="solicitorPhone"]', '07766120000');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('DIVORCE DETAILS', '20');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D84321');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('h4', 'RESPONDENT DETAILS');
  I.fillField('input[id="rSolicitorEmail"]', 'vivupdatesol@mailinator.com');
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
}

function contestedAmendApplicationDetails() {
  const I = this;
  I.waitForText('History', '30');
  I.selectOption('select[id="next-step"]', 'Amend Application Details');
  I.click('Go');

  I.waitForPage('#beforeYouStart');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('input[id="applicantSolicitorPhone"]');
  I.fillField('input[id="applicantSolicitorPhone"]', '07766121111');
  I.waitForContinueButtonEnabled();
  I.click('Continue');


  I.waitForPage('input[id="divorceCaseNumber"]');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D33333');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#applicantFMName');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#respondentFMName');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#respondentRepresented-Yes');
  I.fillField('input[id="rSolicitorEmail"]', 'vivcontestedupdatesol@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('input[id="natureOfApplicationChecklist-propertyAdjustmentOrder"]');
  I.checkOption('input[id="natureOfApplicationChecklist-propertyAdjustmentOrder"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#propertyAdjutmentOrderDetailLabel');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#paymentForChildrenDecision');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#fastTrackDecision');
  I.waitForContinueButtonEnabled();
  I.click('Continue');


  I.waitForPage('#addToComplexityListOfCourts');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('input[id="isApplicantsHomeCourt-No"]');
  I.checkOption('input[id="isApplicantsHomeCourt-No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#applicantAttendedMIAMLabel');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#soleTraderName');
  I.fillField('#soleTraderName', 'sole trading');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#promptForAnyDocument');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#beforeSavePreConfirmation');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('.check-your-answers');
  I.see('Solicitor Details');
  I.see('Divorce Details');
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Do you want to upload any other documents ?');
  I.click('Submit');
  I.see('Amend Application Details');
}

module.exports = { amendApplicationDetails, contestedAmendApplicationDetails };
