/* eslint-disable no-invalid-this */

function amendApplicationDetails() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Amend Application Details');
  I.wait('2');
  I.click('Go');
  I.waitForText('Before You Start', '30');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('SOLICITOR DETAILS', '30');
  I.fillField('input[id="solicitorPhone"]', '07766120000');
  I.waitForText("Search for an organisation","30")
  I.fillField('input[id="search-org-text"]', 'FRApplicantSolicitorFirm');
  I.click('Select');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('APPLICATION DETAILS', '90');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D84321');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('APPLICANT DETAILS', '90');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('RESPONDENT DETAILS', '30');
  I.fillField('input[id="rSolicitorEmail"]', 'vivupdatesol@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('NATURE OF THE APPLICATION', '30');
  I.checkOption('input[value="Property Adjustment Order"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('ORDER FOR CHILDREN', '30');
  I.checkOption('input[id="orderForChildrenQuestion1_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Draft Consent Order', '30')
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.refreshPage();
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('D81', '30');
  I.checkOption('input[id="d81Question_No"]');
  I.wait('2');
  I.attachFile('input[id="d81Applicant"]', '../data/fileupload.txt');
  I.wait('2');
  I.attachFile('input[id="d81Respondent"]', '../data/fileupload.txt');
  I.wait('10');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('PENSION DOCUMENTS', '30');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('OTHER DOCUMENTS', '30');

  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('#createCasePreConfirmationInfoText h1', 'Saving your application');

  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('.check-your-answers h2', 'Check your answers');
  I.see('OTHER DOCUMENTS');
  I.click('Submit');
  I.waitForText('SOLICITOR DETAILS', 60);
  I.see('APPLICANT DETAILS');
}

function contestedAmendApplicationDetails() {
  const I = this;
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

  I.waitForPage('#respondentRepresented_Yes');
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

  I.waitForPage('input[id="isApplicantsHomeCourt_No"]');
  I.checkOption('input[id="isApplicantsHomeCourt_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#applicantAttendedMIAMLabel');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.refreshPage();
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
  // The necessary refresh on L134 has cleared the check your answers page. To be fixed in @DFR-586

  // I.see('Solicitor Details');
  // I.see('Divorce Details');
  // I.see('Applicant’s Details');
  // I.see('Respondent’s Details');
  // I.see('Is the respondent represented ?');
  // I.see('Do you want to upload any other documents ?');

  I.waitForText('Check your answers', '30');
  I.click('Submit');
  I.wait('5');
  I.waitForText('History', '60');
  I.see('Amend Application Details');
  I.wait('5');
}

module.exports = { amendApplicationDetails, contestedAmendApplicationDetails };
