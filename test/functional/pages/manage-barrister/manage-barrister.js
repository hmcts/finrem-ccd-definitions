function  manageBarristerApplicant() {        //Matrimonial Case
  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage Barrister');
  I.wait('2');
  I.click('Go');
  I.waitForText('Manage Barrister', '30');
  I.waitForElement('input[id="barristerParty-applicant"]', '30');
  I.checkOption('input[id="barristerParty-applicant"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Applicant\'s Barristers', '30');
  I.click('Add new');
  I.fillField('input[id="appBarristerCollection_0_name"]', 'FR App Barrister');

  //Negative Scenario: to check the error message
  I.fillField('input[id="appBarristerCollection_0_email"]', 'dfr3@mailinator.com');
  I.fillField('input[id="appBarristerCollection_0_phoneNumber"]', '1111222233');
  I.waitForText('Search for an organisation','30');
  I.fillField('input[id="search-org-text"]', 'FinRem-1-Org');
  I.wait('10');
  I.click('Select');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Errors', '5');
  I.see('Email address for Barrister is not registered with myHMCTS. They can register at https://manage-org.platform.hmcts.net/register-org/register');

  I.fillField('input[id="appBarristerCollection_0_email"]', 'fr_applicant_barrister3@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers', '20');
  I.click('Submit');
}

function manageBarristerRespondent() {
  const I = this;
  I.selectOption('select[id="next-step"]', 'Manage Barrister');
  I.wait('2');
  I.click('Go');
  I.waitForText('Manage Barrister', '30');
  I.waitForElement('input[id="barristerParty-respondent"]', '30');
  I.checkOption('input[id="barristerParty-respondent"]');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Respondent', '30');
  I.click('Add new');
  I.fillField('input[id="respBarristerCollection_0_name"]', 'FR Resp Barrister');

  //Negative Scenario: to check the error message
  I.fillField('input[id="respBarristerCollection_0_email"]', 'dfr3@mailinator.com');
  I.fillField('input[id="respBarristerCollection_0_phoneNumber"]', '1111222233');
  I.waitForText('Search for an organisation','30');
  I.fillField('input[id="search-org-text"]', 'FinRem-2-Org');
  I.wait('30');
  I.click('Select');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Errors', '5');
  I.see('Email address for Barrister is not registered with myHMCTS. They can register at https://manage-org.platform.hmcts.net/register-org/register');

  I.fillField('input[id="respBarristerCollection_0_email"]', 'fr_res_barrister1@mailinator.com');
  I.waitForContinueButtonEnabled();
  I.click('Continue');
  I.waitForText('Check your answers', '20');
  I.click('Submit');
}
module.exports = { manageBarristerApplicant, manageBarristerRespondent };

/*Credentials for Barrister for (AAT and PR)
 App Barrister:
  FinRem-1-Org
 fr_applicant_barrister3@mailinator.com/Testing1234
 fr_applicant_barrister1@mailinator.com/Testing1234

 Respondent Barrister:
 FinRem-2-Org
 fr_res_barrister1@mailinator.com/Testing1234
 fr_res_barrister@mailinator.com/Testing1234*/