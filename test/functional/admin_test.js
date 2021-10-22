Feature('Admin Web');

Scenario('add all the roles @pipeline', I => {
  I.loginToAdminConsole();
  I.createRole('citizen');
  I.createRole('caseworker');
  I.createRole('caseworker-divorce-financialremedy-courtadmin');
  I.createRole('caseworker-divorce-financialremedy-solicitor');
  I.createRole('caseworker-divorce-financialremedy-judiciary');
  I.createRole('caseworker-divorce-systemupdate');
  I.createRole('caseworker-divorce-bulkscan');
  I.createRole('caseworker-divorce-financialremedy');
  I.createRole('caseworker-caa');
  I.click('Manage User Roles');
  I.see('citizen');
  I.see('caseworker');
  I.see('caseworker-divorce-financialremedy-courtadmin');
  I.see('caseworker-divorce-financialremedy-solicitor');
  I.see('caseworker-divorce-financialremedy-judiciary');
  I.see('caseworker-divorce-systemupdate');
  I.see('caseworker-divorce-bulkscan');
  I.see('caseworker-divorce-financialremedy');
  I.see('caseworker-caa');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

Scenario('upload Consented Config file @pipeline', I => {
  I.loginToAdminConsole();
  I.uploadConfig(`../../definitions/consented/xlsx/${process.env.CCD_CONSENTED_FILE_NAME}`);
  I.see('Case Definition data successfully imported');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

Scenario('upload Contested Config file @pipeline', I => {
  I.loginToAdminConsole();
  I.uploadConfig(`../../definitions/contested/xlsx/${process.env.CCD_CONTESTED_FILE_NAME}`);
  I.see('Case Definition data successfully imported');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers
