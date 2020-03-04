Feature('Admin Web');

Scenario('add all the roles', I => {
  I.loginToAdminConsole();
  I.createRole('citizen');
  I.createRole('caseworker');
  I.createRole('caseworker-divorce-courtadmin');
  I.createRole('caseworker-divorce-solicitor');
  I.createRole('caseworker-divorce-courtadmin_beta');
  I.createRole('caseworker-divorce-systemupdate');
  I.createRole('caseworker-divorce-bulkscan');
  I.createRole('caseworker-divorce-courtadmin-la');
  I.createRole('caseworker-divorce-superuser');
  I.click('Manage User Roles');
  I.see('citizen');
  I.see('caseworker');
  I.see('caseworker-divorce-courtadmin');
  I.see('caseworker-divorce-solicitor');
  I.see('caseworker-divorce-courtadmin_beta');
  I.see('caseworker-divorce-systemupdate');
  I.see('caseworker-divorce-bulkscan');
  I.see('caseworker-divorce-courtadmin-la');
  I.see('caseworker-divorce-superuser');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

Scenario('upload Consented Config file', I => {
  I.loginToAdminConsole();
  I.uploadConfig('../../definitions/consented/xlsx/ccd-config-aat-consented.xlsx');
  I.see('Consented Case Definition data successfully imported');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

Scenario('upload Contested Config file', I => {
  I.loginToAdminConsole();
  I.uploadConfig('../../definitions/contested/xlsx/ccd-config-aat-contested.xlsx');
  I.see('Contested Case Definition data successfully imported');
}).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers
