const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('helpers/utils.js');

const ccdWebUrl = process.env.CCD_WEB_URL;

Feature('Smoke Test');

Scenario('Check env running @smoke @crossbrowser', async ({ I }) => {
  await I.amOnPage(`${process.env.CCD_WEB_URL}`);
  await I.wait('5');
  await I.waitForText('Sign in',60);
  await I.see("Log in with your eJudiciary account");
}).retry(3);

if (process.env.IMPORT_PREVIEW) {
  Scenario('add all the roles @smoke', ({ I }) => {
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
    I.createRole('caseworker-divorce-financialremedy-superuser');
    I.createRole('caseworker-approver');
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
    I.see('caseworker-divorce-financialremedy-superuser')
    I.see('caseworker-approver');
  }).retry({ retries: 3, minTimeout: 30000 }); // eslint-disable-line no-magic-numbers

  Scenario('upload Consented preview config file @smoke', ({ I }) => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/consented/xlsx/ccd-config-preview-consented-${process.env.GIT_COMMIT}.xlsx`);
  }).retry({retries: 3, minTimeout: 30000});

  Scenario('upload Contested preview config file @smoke', ({ I }) => {
    I.loginToAdminConsole();
    I.uploadConfig(`../../definitions/contested/xlsx/ccd-config-preview-contested-${process.env.GIT_COMMIT}.xlsx`);
  }).retry({retries: 3, minTimeout: 300000})
}
