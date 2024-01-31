/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

function respondentSolicitorDetailsDetails(I) {
  I.fillField('input[id="rSolicitorName"]', 'ResSol');
  I.fillField('input[id="rSolicitorFirm"]', 'MahFirm');
  I.fillField('input[id="rSolicitorReference"]', 'MahSol73');

  I.waitForText('Search for an organisation', '60');
  I.wait(5);
  I.fillField('input[id="search-org-text"]', 'finrem-2');
  I.wait(5);
  I.click('Select');
  I.waitForText('EC3A 2AD', '5');
  I.fillField('input[id="RespondentOrganisationPolicy_OrgPolicyReference"]', 'res-sox');

  I.fillField('Enter a UK postcode', 'TW3 1SS');
  I.click('Find address');
  I.wait(5);
  I.selectOption('Select an address', '75 Pears Road, Hounslow');
  I.fillField('input[id="rSolicitorAddress__detailAddressLine2"]', 'Flat2');
  I.fillField('input[id="rSolicitorAddress__detailAddressLine3"]', 'Ring Road');
  I.fillField('input[id="rSolicitorAddress__detailCounty"]', 'Essex');
  I.fillField('input[id="rSolicitorPhone"]', '07889009908');
  I.fillField('input[id="rSolicitorEmail"]', 'vivrepondent@mailinator.com');
  I.fillField('input[id="rSolicitorDXnumber"]', '078890');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function consentedRespondentDetails() {
  const I = this;

  I.waitForPage('h4', 'RESPONDENT DETAILS');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="appRespondentFMName"]', 'kiv');
  I.fillField('input[id="appRespondentLName"]', 'resp');
  I.checkOption('input[id="appRespondentRep_Yes"]');
  I.wait('2');
  respondentSolicitorDetailsDetails(I);
}

async function contestedRespondentDetails() {
  const I = this;

  I.waitForPage('#respondentDetailsLabel h2', 'Respondent’s Details');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.fillField('input[id="respondentFMName"]', 'Qunatico');
  I.fillField('input[id="respondentLName"]', 'Whisper');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForPage('#respondentRepresentedLabel h2', 'Is the respondent represented ?');
  I.checkOption('input[id="respondentRepresented_Yes"]');
  I.wait('2');
  respondentSolicitorDetailsDetails(I);
}

module.exports = { consentedRespondentDetails, contestedRespondentDetails };
