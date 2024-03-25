/* eslint-disable no-invalid-this */

function mediationQuestionNo() {
  const I = this;
  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', 5);
  I.checkOption('input[id="applicantAttendedMIAM_No"]');
  I.waitForText('Is the applicant claiming exemption from the requirement to attend a MIAM ?', 5);
  I.checkOption('input[id="claimingExemptionMIAM_Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Exemptions: what is the reason(s) for the applicant not attending a MIAM?', 30);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '4'; checkBoxCtr++) {
    I.checkOption(`#MIAMExemptionsChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence : What evidence of domestic violence or abuse does the applicant have ?', 30);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '22'; checkBoxCtr++) {
    I.checkOption(`#MIAMDomesticViolenceChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForText('If you are unable to provide the required evidence with your application, please use this text box to explain the reasons(s) why', 30);
  I.fillField('#evidenceUnavailableDomesticAbuseMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence: what reason does the applicant have for the application to be made urgently?', 30);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '5'; checkBoxCtr++) {
    I.checkOption(`#MIAMUrgencyReasonChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.fillField('#evidenceUnavailableUrgencyMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence : Previous MIAM attendance or MIAM exemption', 30);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMPreviousAttendanceChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.fillField('#evidenceUnavailablePreviousAttendanceMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence: what other grounds of exemption apply?', 30);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMOtherGroundsChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForText('MIAM Evidence: what other grounds of exemption apply?', 30);
  I.fillField('#evidenceUnavailableOtherGroundsMIAM', 'Test');
  I.waitForText('Please provide any additional information requested in this text box', 30);
  I.fillField('#additionalInfoOtherGroundsMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Form A Application', 5);
  I.fillField('input[id="familyMediatorServiceName1"]', 'Test');
  I.fillField('input[id="soleTraderName1"]', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { mediationQuestionNo };
