

async function manageConfidentialDocuments() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage confidential documents');
  I.wait('2');
  I.click('Go');
  I.waitForText('Confidential documents', '30');
  I.click('Add new');
  I.see('Type (Optional)');
  I.selectOption('select[id="confidentialDocumentsUploaded_0_DocumentType"]', 'Chronology');
  I.attachFile('input[type="file"]', '../data/manageConfidentialDoc.pdf');
  I.wait(5);
  I.click('Submit');
  I.waitForText('Event summary (optional)');
  I.click('Submit');
  I.waitForText('Manage confidential documents', 60);
  await I.clickTab('Confidential Documents');
  I.wait(5);
  I.see('Chronology');
  I.see('manageConfidentialDoc.pdf');
}

module.exports = { manageConfidentialDocuments };