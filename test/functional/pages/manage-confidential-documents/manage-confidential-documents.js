

async function manageConfidentialDocuments() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage confidential documents');
  I.wait('2');
  I.click('Go');
  I.waitForText('Confidential documents uploaded', '30');
  I.click('*[@id="confidentialDocumentsUploaded"]/div/button[2]');
  I.see('Confidential documents uploaded 2');
  I.wait('5');
  I.selectOption('select[id="confidentialDocumentsUploaded_1_DocumentLink"]', 'Form B');
  I.attachFile('input[type="file"]', '../data/confidentialDoc.pdf');
  I.wait('5');
  I.click('Submit');
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Manage confidential documents', '60');
  //TODO can add more validations to verify Upload case documents section- using json file
}

module.exports = { manageConfidentialDocuments };