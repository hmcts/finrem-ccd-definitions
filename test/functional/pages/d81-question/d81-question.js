/* eslint-disable no-invalid-this */

function d81Question() {
  const I = this;
  I.waitForPage('input[id="d81Question_Yes"]');
  I.checkOption('input[id="d81Question_Yes"]');
  I.waitForText('Form D81 Joint Document','30')
  I.attachFile('input[type="file"]', '../data/fileupload.pdf');
  I.wait('10');
  I.click('Continue');
}

module.exports = { d81Question };
