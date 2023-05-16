async function manageInterveners(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage Interveners');
  I.wait('2');
  I.click('Go');
  I.waitForText('Manage Interveners', '30');
  I.checkOption('input[id="intervenersList_intervener1"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Please select appropriate option');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('First Intervener Details');
  I.fillField('input[id="intervener1Name"]', 'Molly Guerra');
  I.fillField('input[id="intervener1Address_intervener1Address_postcodeInput"]', 'LU4 0XX');
  I.wait(5);
  I.click('Find address');
  I.wait(5);
  I.waitForElement('#intervener1Address_intervener1Address_addressList', '30');
  I.selectOption('select[id="intervener1Address_intervener1Address_addressList"]', '1 Goldcrest Close, Luton');

  //Intervener presented
  I.checkOption('input[id="intervener1Represented_Yes"]');
  I.fillField('input[id="intervener1SolName"]', 'Miranda Wiley');
  I.fillField('input[id="intervener1SolicitorFirm"]', 'FR Intervener');
  I.fillField('input[id="intervener1SolicitorReference"]', '234');
  I.fillField('input[id="intervener1SolEmail"]', 'fr_respondent_solicitor1@mailinator.com');
  I.waitForText('Search for an organisation','30');
  I.fillField('input[id="search-org-text"]', 'FinRem-2-Org');
  I.click('Select');
  I.waitForText('EC3A 2AD');
  I.waitForContinueButtonEnabled();
  I.click('Continue');

  I.waitForText('Check your answers','30');
  I.see('Please select intervener to manage');
  I.see('First Intervener Details');
  I.see('Intervener\'s Full Name');
  I.see('Is the Intervener represented ?');
  I.click('Submit');
  I.wait(5);
  I.waitForText('Manage Interveners', '30');

  //click tab
  await I.clickTab('Intervener 1');
  I.wait('5');
  I.waitForText('Intervener\'s Full Name');
  I.waitForText('Organisation');

}

module.exports = { manageInterveners };