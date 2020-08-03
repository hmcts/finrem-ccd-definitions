const { createCaseInCcd, updateCaseInCcd } = require('../helpers/utils');

const ccdWebUrl = process.env.CCD_WEB_URL;
Feature('create Consented case ');

Scenario('Consent Case Creation', async I => {
  const caseId = await createCaseInCcd('./test/data/ccd-consented-basic-data.json', 'FinancialRemedyMVP2');
  // eslint-disable-next-line no-unused-vars
  const caseSubmission = await updateCaseInCcd(caseId, 'FR_applicationPaymentSubmission', './test/data/ccd-hwf-consented-payment.json');
  I.amOnPage(ccdWebUrl + caseId);
});
