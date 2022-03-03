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

if (process.env.IMPORT_PREVIEW) {
  Scenario('upload Consented preview config file @pipeline', I => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/consented/xlsx/ccd-config-preview-consented-base.xlsx`);
    I.see('Case Definition data successfully imported');
  }).retry({retries: 3, minTimeout: 30000});

  Scenario('upload Contested preview config file @pipeline', I => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/contested/xlsx/ccd-config-preview-contested-base.xlsx`);
  }).retry({retries: 3, minTimeout: 300000})
}

if (process.env.IMPORT_AAT) {
  Scenario('upload Consented aat Config file @pipeline', I => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/consented/xlsx/ccd-config-aat-consented-base.xlsx`);
    I.see('Case Definition data successfully imported');
  }).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

  Scenario('upload Contested aat Config file @pipeline', I => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/contested/xlsx/ccd-config-aat-contested-base.xlsx`);
    I.see('Case Definition data successfully imported');
  }).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers
}
