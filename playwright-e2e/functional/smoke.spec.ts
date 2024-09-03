import { test, expect } from '../fixtures/fixtures.ts';
import config from '../config';

test(
  'Smoke Test - e2e Contested Journey',
  { tag: ['@smoke-test', '@accessibility'] },
  async (
    { loginPage, manageCasePage, formAApplicationPage, commonComponents, makeAxeBuilder },
    testInfo
  ) => {
    // Sign in
    await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password);

    // Manage/Create case
    await manageCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.contested,
      config.eventType.formA
    );

    await commonComponents.navigateContinue();

    // Enter applicant details
    await formAApplicationPage.selectOrganisation(
      config.organisationNames.finRem1Org
    );
    await formAApplicationPage.enterSolicitorName('test');
    await formAApplicationPage.enterPhoneNumber('12345678910');
    await formAApplicationPage.enterEmailAddress(config.applicant_solicitor.email);
    await formAApplicationPage.emailConsent(true);
    await formAApplicationPage.matrimonialApplication();
    await commonComponents.navigateContinue();

    // Enter Divorce / Dissolution Details
    await formAApplicationPage.divorceDetails('LV12D12345', config.divorceStage.petitionIssued)
    await commonComponents.navigateContinue();

    //applicant details
    await formAApplicationPage.applicantDetails();
    await commonComponents.navigateContinue();

    //respondent details 
    await formAApplicationPage.respondentDetails();
    await commonComponents.navigateContinue();

    await formAApplicationPage.respondentRepresented(true)
    await formAApplicationPage.selectOrganisation(
      config.organisationNames.finRem2Org
    );
    await formAApplicationPage.enterSolicitorName('Test Respondent');
    await formAApplicationPage.enterPhoneNumber('12345678910');
    await formAApplicationPage.enterEmailAddress(config.applicant_solicitor.email);
    await commonComponents.navigateContinue();
    
    // Nature of App
    await formAApplicationPage.selectNatureOfApplication();
    await commonComponents.navigateContinue();

    // Property Adjustment Order
    await formAApplicationPage.propertyAdjustmentOrder();
    await formAApplicationPage.addAdditionalPropertyAdjustment(true);
    await commonComponents.navigateContinue();

    // Accessability Testing

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });

    expect(accessibilityScanResults.violations).toEqual([]);
  }
);
