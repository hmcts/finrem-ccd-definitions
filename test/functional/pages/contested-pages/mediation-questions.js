/* eslint-disable no-invalid-this */

function mediationQuestion() {
  const I = this;
  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', 5);
  I.checkOption('input[id="applicantAttendedMIAM_Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

function mediationQuestionNoMIAMYesExemption() {
  const I = this;
  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', 5);
  I.checkOption('input[id="applicantAttendedMIAM_No"]');
  I.waitForText('Is the applicant claiming exemption from the requirement to attend a MIAM ?', 5);
  I.checkOption('input[id="claimingExemptionMIAM_Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Exemptions: what is the reason(s) for the applicant not attending a MIAM?', 5);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '4'; checkBoxCtr++) {
    I.checkOption(`#MIAMExemptionsChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence : What evidence of domestic abuse does the applicant have ?', 5);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMDomesticViolenceChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForText('If you are unable to provide the required evidence with your application, please use this text box to explain the reasons(s) why', 30);
  I.fillField('#evidenceUnavailableDomesticAbuseMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence: what reason does the applicant have for the application to be made urgently?', 5);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMUrgencyReasonChecklist .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.fillField('#evidenceUnavailableUrgencyMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence : Previous MIAM attendance or MIAM exemption', 5);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMPreviousAttendanceChecklistV2 .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.fillField('#evidenceUnavailablePreviousAttendanceMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('MIAM Evidence: what other grounds of exemption apply?', 5);
  for (let checkBoxCtr = '1'; checkBoxCtr <= '2'; checkBoxCtr++) {
    I.checkOption(`#MIAMOtherGroundsChecklistV2 .multiple-choice:nth-of-type(${checkBoxCtr}) input`);
  }
  I.waitForText('MIAM Evidence: what other grounds of exemption apply?', 5);
  I.fillField('#evidenceUnavailableOtherGroundsMIAM', 'Test');
  I.waitForText('Please provide any additional information requested in this text box', 5);
  I.fillField('#additionalInfoOtherGroundsMIAM', 'Test');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

function mediationQuestionNoMIAMNoExemption() {
  const I = this;
  I.waitForText('Has the applicant attended a Mediation information & Assessment Meeting (MIAM)?', 5);
  I.checkOption('input[id="applicantAttendedMIAM_No"]');
  I.waitForText('Is the applicant claiming exemption from the requirement to attend a MIAM ?', 5);
  I.checkOption('input[id="claimingExemptionMIAM_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.see("You cannot make this application to court unless the applicant has either attended, or is exempt from attending a MIAM. Please refer to https://www.familymediationcouncil.org.uk/family-mediation/assessment-meeting-miam/ for further information on what to do next and how to arrange a MIAM.")
}

module.exports = { mediationQuestion, mediationQuestionNoMIAMYesExemption, mediationQuestionNoMIAMNoExemption };
