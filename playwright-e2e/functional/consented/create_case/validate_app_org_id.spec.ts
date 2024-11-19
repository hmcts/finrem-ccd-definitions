import { test, expect } from '../../../fixtures/fixtures';
import config from '../../../config';

test(
  'validate_app_org_id - Validating error when Organisation ID is empty for Applicant Solicitor consented',
  { tag: [ '@accessibility'] },
  async (
    { loginPage,
      createCasePage,
      startPage,
      solicitorDetailsPage,
      makeAxeBuilder
    },
    testInfo
  ) => {
    // Sign in
    await loginPage.login(config.caseWorker.email, config.caseWorker.password);

    // Start the consented case
    await createCasePage.startCase(
      config.jurisdiction.familyDivorce,
      config.caseType.consented,
      config.eventType.consentOrder
    );

    await startPage.navigateContinue();

    // Enter applicant details
    await solicitorDetailsPage.setApplicantRepresentation(true);
    await solicitorDetailsPage.enterFirmName('Finrem-1-Org');
    await solicitorDetailsPage.enterUKaddress();
    await solicitorDetailsPage.enterSolicitorDetails('Test App Sol', config.applicant_solicitor.email);
    await solicitorDetailsPage.setEmailConsent(config.caseType.consented)
    await solicitorDetailsPage.navigateContinue();
    
    //Expect error validation for Organisation ID
    await solicitorDetailsPage.assertOrganisationIdRequired();

    if (config.run_accessibility) {
      const accessibilityScanResults = await makeAxeBuilder().analyze();

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  }
)

