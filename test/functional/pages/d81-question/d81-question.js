/* eslint-disable no-invalid-this */

function d81Question() {
  const I = this;
  I.waitForPage('input[id="d81Question-Yes"]');
  I.checkOption('input[id="d81Question-Yes"]');
  I.attachFile('input[type="file"]', '../data/fileupload.txt');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { d81Question };
