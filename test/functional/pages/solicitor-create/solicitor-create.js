/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';
const runningEnv = process.env.RUNNING_ENV || 'aat';
const fileEnv = runningEnv === 'demo'? '-demo': '';
const solicitorData = require(`../../../data/applicant-solicitor-data${fileEnv}.json`);

async function solicitorCreate(reference) {
  const I = this;
  I.waitForElement('h4', '15');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.see('SOLICITOR DETAILS');
  I.fillField('input[id="solicitorName"]', solicitorData.solicitorName);
  I.fillField('input[id="solicitorFirm"]', solicitorData.solicitorFirm);
  I.fillField('input[id="solicitorReference"]', reference);
  I.fillField('#solicitorAddress_solicitorAddress_postcodeInput', solicitorData.solicitorPostcode);
  I.click('div[id="solicitorAddress_solicitorAddress_postcodeLookup"] button[type="button"]');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('Select an address', solicitorData.solicitorSelectAddress);
  I.fillField('input[id="solicitorAddress__detailAddressLine2"]', solicitorData.solicitorAddressLine2);
  I.fillField('input[id="solicitorAddress__detailAddressLine3"]', solicitorData.solicitorAddressLine3);
  I.fillField('input[id="solicitorAddress__detailCounty"]', solicitorData.solicitorCounty);
  I.fillField('input[id="solicitorPhone"]', solicitorData.solicitorPhone);
  I.fillField('input[id="solicitorEmail"]', solicitorData.solicitorEmail);
  I.fillField('input[id="solicitorDXnumber"]', solicitorData.solicitorDXNumber);
  I.waitForText('Search for an organisation','30')
  I.checkOption('input[id="solicitorAgreeToReceiveEmails_Yes"]');
  I.fillField('input[id="search-org-text"]', solicitorData.solicitorSearchText);
  I.click('Select');
  I.waitForText(solicitorData.solicitorOrgPostcode);
  I.fillField('input[id="ApplicantOrganisationPolicy_OrgPolicyReference"]', solicitorData.solicitorReference);
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedSolicitorCreate(reference) {
  const I = this;
  I.waitForPage('#applicantSolicitorDetailLabel h2', 'Solicitor Details');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="applicantSolicitorName"]', solicitorData.solicitorName);
  I.fillField('input[id="applicantSolicitorFirm"]', solicitorData.solicitorFirm);
  I.fillField('//*[@id="solicitorReference"]', reference);
  I.fillField('#applicantSolicitorAddress_applicantSolicitorAddress_postcodeInput', solicitorData.solicitorPostcode);

  I.click('div[id="applicantSolicitorAddress_applicantSolicitorAddress_postcodeLookup"] button[type="button"]');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('select[id="applicantSolicitorAddress_applicantSolicitorAddress_addressList"]', solicitorData.solicitorSelectAddress);
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine2"]', solicitorData.solicitorAddressLine2);
  I.fillField('input[id="applicantSolicitorAddress__detailAddressLine3"]', solicitorData.solicitorAddressLine3);
  I.fillField('input[id="applicantSolicitorAddress__detailCounty"]', solicitorData.solicitorCounty);
  I.fillField('input[id="applicantSolicitorPhone"]', solicitorData.solicitorPhone);
  I.fillField('input[id="applicantSolicitorEmail"]',solicitorData.solicitorEmail);
  I.fillField('input[id="applicantSolicitorDXnumber"]', solicitorData.solicitorDXNumber);
  I.waitForText('Search for an organisation','30')
  I.checkOption('input[id="applicantSolicitorConsentForEmails_Yes"]');
  I.fillField('input[id="search-org-text"]', solicitorData.solicitorSearchText);
  I.click('Select');
  I.wait(30);
  I.waitForText( solicitorData.solicitorOrgPostcode, '30');
  I.fillField('input[id="ApplicantOrganisationPolicy_OrgPolicyReference"]', solicitorData.solicitorReference);
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}


module.exports = { solicitorCreate, contestedSolicitorCreate };
