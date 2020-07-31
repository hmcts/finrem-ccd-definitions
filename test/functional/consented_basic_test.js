const { createCaseInCcd } = require('../helpers/utils');

const ccdWebUrl = process.env.CCD_WEB_URL;
Feature('create Consented case ');

Scenario('Consent Case Creation', async I => {
  const caseId = await createCaseInCcd();
  I.amOnPage(ccdWebUrl + caseId);
});