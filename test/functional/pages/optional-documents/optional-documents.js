/* eslint-disable no-invalid-this */

function optionalDocuments() {
  const I = this;

  I.waitForPage('h4', 'PENSION DOCUMENTS');
  I.click('Add new', { css: '#pensionCollection>div>button' });
  I.wait('2');
  I.selectOption('select[id=pensionCollection_0_typeOfDocument]', 'Form P1');
  I.attachFile('input[type="file"]', '../data/dummy.pdf');
  I.wait('5');
  I.click('button[type = "submit"]');
}

function consentedOtherDocuments() {
  const I = this;
  I.waitForPage('h4', 'OTHER DOCUMENTS');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}


module.exports = { optionalDocuments, consentedOtherDocuments };
