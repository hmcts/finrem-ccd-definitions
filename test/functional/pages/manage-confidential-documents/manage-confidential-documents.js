

async function manageConfidentialDocuments() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage confidential documents');
  I.wait('2');
  I.click('Go');
  I.waitForText('Confidential documents uploaded', '30');
  I.click('//*[@id="confidentialDocumentsUploaded"]/div/button');
  I.see('Confidential documents uploaded');
  I.wait('5');
  I.selectOption('select[id="confidentialDocumentsUploaded_0_DocumentType"]', 'Chronology');
  I.attachFile('input[type="file"]', '../data/manageConfidentialDoc.pdf');
  I.wait('5');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Manage confidential documents', '60');
  await I.clickTab('Confidential documents');
  I.wait('5');
  I.see('Confidential documents uploaded');
}

module.exports = { manageConfidentialDocuments };