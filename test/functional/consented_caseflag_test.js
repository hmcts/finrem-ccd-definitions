const { createCaseInCcd, updateCaseInCcd, createSolicitorReference } = require('../helpers/utils');
const verifyTabText = require('../data/verify-consented-tab-data.json');

const ccdWebUrl = process.env.CCD_WEB_URL;
const solicitorUserName = process.env.USERNAME_SOLICITOR;
const solicitorPassword = process.env.PASSWORD_SOLICITOR;
const caseWorkerUserName = process.env.USERNAME_CASEWORKER;
const caseWorkerPassword = process.env.PASSWORD_CASEWORKER;
const judgeUserName = process.env.USERNAME_JUDGE;
const judgePassword = process.env.PASSWORD_JUDGE;
const nightlyTest = process.env.NIGHTLY_TEST;
const runningEnv = process.env.RUNNING_ENV;
const solRef = `AUTO-${createSolicitorReference()}`;


Feature('Consented case flag');


/*Scenario('Caseworker creates case flag  @nightly @pipeline', async I => {
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag
        //validate flag in tab
}).retry(2);*/

/*Scenario('Caseworker manage case flag  @nightly @pipeline', async I => {
        //TODO- add API call to create case - end state should be application drafted
        //add 1 case flag (this can be done via API call too)
       //manage case flag
       //validate inactivated flag in a tab
}).retry(2);*/


/*Scenario('Judge creates case flag  @nightly @pipeline', async I => {
        //TODO- add API call to create case via caseworker - end state should be application drafted
        //add 1 case flag
        //validate flag in tab
}).retry(2);*/

/*Scenario('Judge manage case flag  @nightly @pipeline', async I => {
        //TODO- add API call to create case via caseworker- end state should be application drafted
        //add 1 case flag (this can be done via API call too)
       //manage case flag
       //validate inactivated flag in a tab
}).retry(2);*/
