async function contestedCaseworkerCreate(reference, applicationType, applicantRepresent) {
  const I = this;
  I.waitForPage('#applicantRepresentedLabel', 'Is the Applicant represented ?');

  if (applicantRepresent == true) {
    I.checkOption('#applicantRepresented_Yes');
  } else {
    I.checkOption('#applicantRepresented_No');
  }
  I.fillField('input[id="applicantSolicitorName"]', 'Parrot');
  I.fillField('//*[@id="solicitorReference"]', reference);
  I.fillField('input[id="applicantSolicitorFirm"]', 'MSN Firm');

  I.fillField('#applicantSolicitorAddress_applicantSolicitorAddress_postcodeInput', 'TW3 1SS');

  I.click('div[id="applicantSolicitorAddress_applicantSolicitorAddress_postcodeLookup"] button[type="button"]');
  I.waitForElement('#selectAddress', '30');
  I.wait('10');
  I.selectOption('select[id="applicantSolicitorAddress_applicantSolicitorAddress_addressList"]', '67 Pears Road, Hounslow');
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine2"]', 'Near Roundabout');
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine3"]', 'Opposite Tesco');
  I.fillField('input[id="applicantSolicitorAddress__detailCounty"]', 'Middlesex');
  I.fillField('input[id="applicantSolicitorPhone"]', '07000000');
  I.fillField('input[id="applicantSolicitorEmail"]', 'fr_applicant_sol@sharklasers.com');
  I.fillField('input[id="applicantSolicitorDXnumber"]', '776890');
  I.waitForText('Search for an organisation','30')
  I.checkOption('input[id="applicantSolicitorConsentForEmails_Yes"]');
  I.fillField('input[id="search-org-text"]', 'FinRem-1-Org');
  I.wait('5');
  I.click('Select');
  I.wait('5');
  I.waitForText('EC3A 2AD');
  I.fillField('input[id="ApplicantOrganisationPolicy_OrgPolicyReference"]', 'FRApplicant');

  if (applicationType== 'Schedule1') {
    I.checkOption('input[id="typeOfApplication-Under paragraph 1 or 2 of schedule 1 children act 1989"]');
  }

  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.wait('10');
}



module.exports = { contestedCaseworkerCreate };