async function manageIntervenersAmend(){

    const I = this;
    I.selectOption('select[id="next-step"]', 'Manage Interveners');
    I.wait('2');
    I.click('Go');
    I.waitForText('Manage Interveners', '30');
    I.checkOption('input[id="intervenersList_intervener1"]');     //checking "Interverner1: NameHere" radio button option in the UI
    I.waitForContinueButtonEnabled();
    I.click('Continue');
    I.waitForText('Please select appropriate option', '30');
    I.checkOption('input[id="intervenerOptionList_addIntervener1"]')   //checking "Amend Intervener1" radio button option in the UI
    I.waitForContinueButtonEnabled();
    I.click('Continue');
    I.waitForText('First Intervener Details', '30');
    //I.checkOption('input[id="intervener1_intervenerName"]')
    I.fillField('input[id="intervener1_intervenerName"]', 'Updated Name by Amend Event');   //updates the "Intervener's 1 Full Name" field
    I.waitForContinueButtonEnabled();
    I.click('Continue');  
    I.waitForText('Check your answers', '30');
    I.see('Amend Intervener 1');
    I.click('Submit');
    I.waitForText('Manage Interveners', '30');
  
  }
  
  module.exports = { manageIntervenersAmend };