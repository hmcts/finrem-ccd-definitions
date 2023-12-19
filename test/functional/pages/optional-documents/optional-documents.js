/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function optionalDocuments() {
  const I = this;
  I.waitForPage('h4', 'PENSION DOCUMENTS');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.click('Add new', { css: '#pensionCollection>div>button' });
  I.wait('2');
  I.selectOption('select[id=pensionCollection_0_typeOfDocument]', 'Form P1');
  I.attachFile('input[type="file"]', '../data/dummy.pdf');
  I.wait('5');
  I.click('button[type = "submit"]');
}

async function consentedOtherDocuments() {
  const I = this;
  I.waitForPage('h4', 'OTHER DOCUMENTS');
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedOtherDocuments() {
  const I = this;
  I.waitForText('Do you want to upload any other documents ?', 5);
  if (testForAccessibility=='true') {
    await I.runAccessibilityTest();
  }
  I.checkOption('input[id="promptForAnyDocument_No"]');
  I.checkOption('input[id="promptForUrgentCaseQuestion_No"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { optionalDocuments, consentedOtherDocuments, contestedOtherDocuments };
