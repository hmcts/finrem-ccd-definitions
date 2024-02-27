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