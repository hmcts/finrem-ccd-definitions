async function manageIntervenersAdd(flag){

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
  I.fillField('input[id="intervener1_intervenerName"]', 'Molly Guerra');
  I.fillField('input[id="intervener1_intervenerAddress_intervenerAddress_postcodeInput"]', 'LU4 0XX');
  I.wait(5);
  I.click('Find address');
  I.wait(5);
  I.waitForElement('#intervener1_intervenerAddress_intervenerAddress_addressList', '30');
  I.selectOption('select[id="intervener1_intervenerAddress_intervenerAddress_addressList"]', '1 Goldcrest Close, Luton');

      if (flag=='represented') {
        //Intervener presented
        I.checkOption('input[id="intervener1_intervenerRepresented_Yes"]');
        I.fillField('input[id="intervener1_intervenerSolName"]', 'Miranda Wiley');
        I.fillField('input[id="intervener1_intervenerSolicitorFirm"]', 'FR Intervener');
        I.fillField('input[id="intervener1_intervenerSolicitorReference"]', '234');
        I.fillField('input[id="intervener1_intervenerSolEmail"]', 'fr_applicant_barrister1@mailinator.com');
        I.waitForText('Search for an organisation','30');
        I.fillField('input[id="search-org-text"]', 'FinRem-1-Org');
        I.click('Select');
        I.waitForText('EC3A 2AD');
      }

      if (flag=='notRepresented') {
        I.checkOption('input[id="intervener1_intervenerRepresented_No"]');
      }

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

}

module.exports = { manageIntervenersAdd };