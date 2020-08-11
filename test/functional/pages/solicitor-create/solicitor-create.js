/* eslint-disable no-invalid-this */

function solicitorCreate(reference) {
  const I = this;
  I.waitForElement('h4', '5');
  I.see('SOLICITOR DETAILS');
  I.fillField('input[id="solicitorName"]', 'Arrow');
  I.fillField('input[id="solicitorFirm"]', 'Abc Firm');
  I.fillField('input[id="solicitorReference"]', reference);
  I.fillField('#solicitorAddress_solicitorAddress_postcodeInput', 'TW3 1SS');
  I.click('#solicitorAddress_solicitorAddress #postcodeLookup button');
  I.waitForElement('#selectAddress', '30');
  I.wait('5');
  I.selectOption('Select an address', '67 Pears Road, Hounslow');
  I.fillField('input[id="solicitorAddress_AddressLine2"]', 'Near Roundabout');
  I.fillField('input[id="solicitorAddress_AddressLine3"]', 'Opposite Tesco');
  I.fillField('input[id="solicitorAddress_County"]', 'Middlesex');
  I.fillField('input[id="solicitorPhone"]', '07700000');
  I.fillField('input[id="solicitorEmail"]', 'fr_applicant_sol@sharklasers.com');
  I.fillField('input[id="solicitorDXnumber"]', '776890');
  I.checkOption('input[id="solicitorAgreeToReceiveEmails-Yes"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}


module.exports = { solicitorCreate };
