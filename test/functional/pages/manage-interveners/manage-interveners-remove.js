async function manageIntervenersRemove(){

  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage Interveners');
  I.wait('2');
  I.click('Go');
  I.waitForText('Manage Interveners', '30');
  I.checkOption('input[id="intervenersList_intervener1"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Please select appropriate option');
  I.checkOption('input[id="intervenerOptionList_delIntervener1"]')
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers');
  I.see('Remove Intervener 1');
  I.click('Submit');
  I.waitForText('Manage Interveners', '30');

}

module.exports = { manageIntervenersRemove };