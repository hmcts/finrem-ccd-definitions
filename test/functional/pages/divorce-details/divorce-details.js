/* eslint-disable no-invalid-this */
const testForAccessibility = process.env.TESTS_FOR_ACCESSIBILITY || 'false';

async function divorceDetails() {
  const I = this;
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.waitForPage('h4', 'APPLICATION DETAILS');
  I.fillField('input[id="divorceCaseNumber"]', 'LV18D81234');
  I.selectOption('select[id="divorceStageReached"]', 'Decree Nisi / Conditional Order');
  I.wait('5');
  I.retry('3').attachFile('input[type="file"]', '../data/fileupload.txt');
  I.wait('5');
  I.fillField('input[id="divorceDecreeNisiDate-day"]', '1');
  I.fillField('input[id="divorceDecreeNisiDate-month"]', '2');
  I.fillField('input[id="divorceDecreeNisiDate-year"]', '2019');
  I.wait('2');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

async function contestedDivorceDetails() {
  const I = this;
  if (testForAccessibility==='true') {
    await I.runAccessibilityTest();
  }
  I.waitForPage('#divorceDetailsLabel h2', 'Divorce / Dissolution Details');
  I.fillField('input[id="divorceCaseNumber"]', 'EM18D54321');
  I.fillField('input[id="dateOfMarriage-day"]', '1');
  I.fillField('input[id="dateOfMarriage-month"]', '2');
  I.fillField('input[id="dateOfMarriage-year"]', '2000');
  I.fillField('input[id="dateOfSepration-day"]', '2');
  I.fillField('input[id="dateOfSepration-month"]', '3');
  I.fillField('input[id="dateOfSepration-year"]', '2010');
  I.fillField('input[id="divorcePetitionIssuedDate-day"]', '14');
  I.fillField('input[id="divorcePetitionIssuedDate-month"]', '8');
  I.fillField('input[id="divorcePetitionIssuedDate-year"]', '2020');
  I.fillField('#nameOfCourtDivorceCentre', 'Brentford Court');
  I.selectOption('select[id="divorceStageReached"]', 'Decree Nisi / Conditional Order');
  I.wait('2');
  I.retry('3').attachFile('input[type="file"]', '../data/fileupload.txt');
  I.wait('5');
  I.fillField('input[id="divorceDecreeNisiDate-day"]', '15');
  I.fillField('input[id="divorceDecreeNisiDate-month"]', '8');
  I.fillField('input[id="divorceDecreeNisiDate-year"]', '2020');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
}

module.exports = { divorceDetails, contestedDivorceDetails };
