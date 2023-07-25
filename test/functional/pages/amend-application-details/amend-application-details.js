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
  // I.waitForText("Search for an organisation","30")
  // I.fillField('input[id="search-org-text"]', 'FRApplicantSolicitorFirm');
  // I.click('Select');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('APPLICATION DETAILS', '90');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D84321');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('APPLICANT DETAILS', '90');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('RESPONDENT DETAILS', '90');
  I.fillField('input[id="rSolicitorEmail"]', 'vivupdatesol@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('NATURE OF THE APPLICATION', '90');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  // I.waitForText('ORDER FOR CHILDREN', '30');
  // I.checkOption('input[id="orderForChildrenQuestion1_No"]');
  // I.waitForContinueButtonEnabled();
  // I.click('Continue');
  I.waitForText('Draft Consent Order', '90')
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  //I.refreshPage();
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

  //TODO
  // add other validation

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

  I.waitForText('Is the Applicant represented ?');
  I.waitForText('FRApplicantSolicitorFirm');
  I.waitForContinueButtonEnabled();
  I.click('Continue');


  I.waitForPage('input[id="divorceCaseNumber"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#applicantFMName');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#respondentFMName');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#respondentRepresented_Yes');
  I.fillField('input[id="rSolicitorPhone"]', '+1 (365) 362-99777');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('What is the nature of the application ?');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#propertyAdjutmentOrderDetailLabel');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#paymentForChildrenDecision input');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#fastTrackDecision');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#addToComplexityListOfCourts');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('input[id="isApplicantsHomeCourt_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('Enter details of MIAM certification');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#promptForAnyDocument');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('#beforeSavePreConfirmation');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForPage('.check-your-answers');
  I.waitForText('Check your answers', '30');
  I.see('Solicitor Details');
  I.see('Applicant’s Details');
  I.see('Respondent’s Details');
  I.see('Is the respondent represented ?');
  I.see('Do you want to upload any other documents ?');


  I.click('Submit');
  I.wait('5');
  I.waitForText('History', '30');
  I.see('Amend Application Details');
  I.wait('5');
}

module.exports = { amendApplicationDetails, contestedAmendApplicationDetails };
