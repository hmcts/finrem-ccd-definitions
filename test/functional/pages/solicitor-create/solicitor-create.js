/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function solicitorCreate(reference) {
  const I = this;
  I.waitForElement('h4', '15');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.see('SOLICITOR DETAILS');
  I.fillField('input[id="solicitorName"]', 'Arrow');
  I.fillField('input[id="solicitorFirm"]', 'Abc Firm');
  I.fillField('input[id="solicitorReference"]', reference);
  I.fillField('#solicitorAddress_solicitorAddress_postcodeInput', 'TW3 1SS');
  I.click('div[id="solicitorAddress_solicitorAddress_postcodeLookup"] button[type="button"]');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('Select an address', '67 Pears Road, Hounslow');
  I.fillField('input[id="solicitorAddress__detailAddressLine2"]', 'Near Roundabout');
  I.fillField('input[id="solicitorAddress__detailAddressLine3"]', 'Opposite Tesco');
  I.fillField('input[id="solicitorAddress__detailCounty"]', 'Middlesex');
  I.fillField('input[id="solicitorPhone"]', '07700000');
  I.fillField('input[id="solicitorEmail"]', 'fr_applicant_sol@sharklasers.com');
  I.fillField('input[id="solicitorDXnumber"]', '776890');
  I.waitForText('Search for an organisation','30')
  I.checkOption('input[id="solicitorAgreeToReceiveEmails_Yes"]');
  I.fillField('input[id="search-org-text"]', 'finrem-1');
  I.click('Select');
  I.waitForText('EC3A 2AD');
  I.fillField('input[id="ApplicantOrganisationPolicy_OrgPolicyReference"]', 'FRApplicant');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedSolicitorCreate(reference, applicationType) {
  const I = this;
  I.waitForPage('#applicantSolicitorDetailLabel h2', 'Solicitor Details');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="applicantSolicitorName"]', 'Parrot');
  I.fillField('input[id="applicantSolicitorFirm"]', 'MSN Firm');
  I.fillField('//*[@id="solicitorReference"]', reference);
  I.fillField('#applicantSolicitorAddress_applicantSolicitorAddress_postcodeInput', 'TW3 1SS');

  I.click('div[id="applicantSolicitorAddress_applicantSolicitorAddress_postcodeLookup"] button[type="button"]');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('select[id="applicantSolicitorAddress_applicantSolicitorAddress_addressList"]', '67 Pears Road, Hounslow');
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine2"]', 'Near Roundabout');
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine3"]', 'Opposite Tesco');
  I.fillField('input[id="applicantSolicitorAddress__detailCounty"]', 'Middlesex');
  I.fillField('input[id="applicantSolicitorPhone"]', '07000000');
  I.fillField('input[id="applicantSolicitorEmail"]', 'fr_applicant_sol@sharklasers.com');
  I.fillField('input[id="applicantSolicitorDXnumber"]', '776890');
  I.waitForText('Search for an organisation',60);
  I.checkOption('input[id="applicantSolicitorConsentForEmails_Yes"]');
  I.fillField('input[id="search-org-text"]', 'FinRem-1-Org');
  I.click('Select');
  I.waitForText('EC3A 2AD');
  I.fillField('input[id="ApplicantOrganisationPolicy_OrgPolicyReference"]', 'FRApplicant');
  if (applicationType== 'Schedule1') {
    I.checkOption('input[id="typeOfApplication-Under paragraph 1 or 2 of schedule 1 children act 1989"]');
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}


module.exports = { solicitorCreate, contestedSolicitorCreate };
