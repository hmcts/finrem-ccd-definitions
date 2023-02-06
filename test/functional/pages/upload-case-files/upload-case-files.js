

async function uploadCaseFiles() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Upload Case Files');
  I.wait('2');
  I.click('Go');
  I.waitForText('Upload case documents', '30');
  I.click('//*[@id="uploadCaseDocument"]/div/button');
  I.attachFile('input[type="file"]', '../data/confidentialDoc.pdf');
  I.wait('5');
  I.selectOption('select[id="uploadCaseDocument_0_caseDocumentType"]', 'Chronology');
  I.fillField('#uploadCaseDocument_0_hearingDetails', 'this is confidential document');
  I.checkOption('input[id="uploadCaseDocument_0_caseDocumentConfidential_Yes"]');
  //TODO - can test add new and remove button
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers');
  I.see('Is the document confidential?');
  //TODO can add more validations to verify Upload case documents section- using json file
  I.click('Submit');
  I.waitForText('Upload Case Files', '60');
  await I.clickTab('Confidential documents');
  I.wait('5');
  I.see('Confidential documents uploaded');
}

module.exports = { uploadCaseFiles };