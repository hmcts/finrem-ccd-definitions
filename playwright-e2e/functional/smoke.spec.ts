import { test, expect } from '../fixtures/fixtures.ts';
import config from '../config';

test(
  'Smoke Test - e2e Contested Journey',
  { tag: ['@smoke-test', '@accessibility'] },
  async (
    { loginPage, manageCasePage, formAApplicationPage, makeAxeBuilder },
    testInfo
  ) => {
    // Sign in
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);

    // Manage/Create case
    await manageCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested
    );

    // Enter applicant details
    await formAApplicationPage.continueApplication();
    await formAApplicationPage.selectOrganisation(
      config.organisationNames.finRem1Org
    );
    await formAApplicationPage.enterPhoneNumber('12345678910');
    await formAApplicationPage.enterEmailAddress(config.caseWorker.email);
    await formAApplicationPage.emailConsent(true);

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
);
