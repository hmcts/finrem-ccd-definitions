/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';
const runningEnv = process.env.RUNNING_ENV || 'aat';
const fileEnv = runningEnv === 'demo'? '-demo': '';
const solicitorData = require(`../../../data/respondent-solicitor-data${fileEnv}.json`);

function respondentSolicitorDetailsDetails(I) {
  I.fillField('input[id="rSolicitorName"]', solicitorData.solicitorName);
  I.fillField('input[id="rSolicitorFirm"]', solicitorData.solicitorFirm);
  I.fillField('input[id="rSolicitorReference"]', solicitorData.solicitorReference);
  I.waitForText('Search for an organisation', '30');
  I.fillField('input[id="search-org-text"]', solicitorData.solicitorSearchText);
  I.click('Select');
  I.waitForText(solicitorData.solicitorOrgPostcode, '5');
  I.fillField('input[id="RespondentOrganisationPolicy_OrgPolicyReference"]', solicitorData.solicitorOrgReference);
  I.fillField('Enter a UK postcode', solicitorData.solicitorPostcode);
  I.click('Find address');
  I.wait('5');
  I.selectOption('Select an address', solicitorData.solicitorSelectAddress);
  I.fillField('input[id="rSolicitorAddress__detailAddressLine2"]', solicitorData.solicitorAddressLine2);
  I.fillField('input[id="rSolicitorAddress__detailAddressLine3"]', solicitorData.solicitorAddressLine3);
  I.fillField('input[id="rSolicitorAddress__detailCounty"]', solicitorData.solicitorCounty);
  I.fillField('input[id="rSolicitorPhone"]', solicitorData.solicitorPhone);
  I.fillField('input[id="rSolicitorEmail"]', solicitorData.solicitorEmail);
  I.fillField('input[id="rSolicitorDXnumber"]', solicitorData.solicitorDXNumber);
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