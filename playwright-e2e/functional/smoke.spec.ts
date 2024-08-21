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
    await loginPage.login(config.solicitor.email, config.solicitor.password);

    // Manage/Create case
    await manageCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    // Enter applicant details
    await formAApplicationPage.continueApplication();
    await formAApplicationPage.selectOrganisation(
      config.organisationNames.finRem1Org
    );
    await formAApplicationPage.enterSolicitorName('test');
    await formAApplicationPage.enterPhoneNumber('12345678910');
    await formAApplicationPage.enterEmailAddress(config.solicitor.email);
    await formAApplicationPage.emailConsent(true);
    await formAApplicationPage.matriomnialApplication();
    await formAApplicationPage.continueApplication();

    // Enter Divorce / Dissolution Details
    await formAApplicationPage.divorceDetails('LV12D12345', config.divorceStage.petitionIssued)
    await formAApplicationPage.continueApplication();

    //applicant details
    await formAApplicationPage.applicantDetails();
    await formAApplicationPage.continueApplication();

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
);
