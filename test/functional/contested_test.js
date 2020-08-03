const { createCaseInCcd, updateCaseInCcd } = require('../helpers/utils');

const ccdWebUrl = process.env.CCD_WEB_URL;
Feature('create Contested case ');

Scenario('Contested Case Creation', async I => {
  const caseId = await createCaseInCcd('./test/data/ccd-contested-basic-data.json', 'FinancialRemedyContested');
  // eslint-disable-next-line no-unused-vars
  const caseSubmission = await updateCaseInCcd(caseId, 'FR_applicationPaymentSubmission', './test/data/ccd-contested-basic-data.json');
  I.amOnPage(ccdWebUrl + caseId);
});
