Feature('Admin Web');

Scenario('add all the roles', I => {
  I.loginToAdminConsole();
  I.createRole('citizen');
  I.createRole('caseworker');
  I.createRole('caseworker-divorce-financialremedy-courtadmin');
  I.createRole('caseworker-divorce-financialremedy-solicitor');
  I.createRole('caseworker-divorce-financialremedy-courtadmin_beta');
  I.createRole('caseworker-divorce-financialremedy-systemupdate');
  I.createRole('caseworker-divorce-financialremedy-bulkscan');
  I.createRole('caseworker-divorce-financialremedy-courtadmin-la');
  I.createRole('caseworker-divorce-financialremedy-superuser');
  I.createRole('caseworker-divorce-financialremedy-judiciary');
  I.click('Manage User Roles');
  I.see('citizen');
  I.see('caseworker');
  I.see('caseworker-divorce-financialremedy-courtadmin');
  I.see('caseworker-divorce-financialremedy-solicitor');
  I.see('caseworker-divorce-financialremedy-courtadmin_beta');
  I.see('caseworker-divorce-financialremedy-systemupdate');
  I.see('caseworker-divorce-financialremedy-bulkscan');
  I.see('caseworker-divorce-financialremedy-courtadmin-la');
  I.see('caseworker-divorce-financialremedy-superuser');
  I.see('caseworker-divorce-financialremedy-judiciary');
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
