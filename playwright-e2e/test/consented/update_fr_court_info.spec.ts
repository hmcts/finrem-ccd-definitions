import { test } from '../../fixtures/fixtures';
import config from '../../config/config';
import { ConsentedEvents } from '../../config/case-data';
import { ConsentedCaseFactory } from '../../data-utils/factory/consented/ConsentedCaseFactory';

test(
  'Consented - Update FR court info',
  { tag: [] },
  async (
    { 
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      financialRemedyCourtPage,
      axeUtils
    }, testInfo
  ) => {
    // Create case and progress to Issue Application
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToIssueApplication();

    // Login in as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Update FR court info 
    await caseDetailsPage.selectNextStep(ConsentedEvents.updateFrCourtInfo);
    await financialRemedyCourtPage.selectCourtZoneDropDown(
        'High Court Family Division', 
        'High Court Family Division FRC',
        'High Court Family Division' 
    );
    await financialRemedyCourtPage.navigateContinue();
    await financialRemedyCourtPage.verifyHighCourtConsentErrorIsVisible(); // Verify error shown for High Court selection for Consented case
    await financialRemedyCourtPage.selectCourtZoneDropDown(
        'Midlands', 
        'Birmingham FRC',
        'DERBY MAGISTRATES COURT' 
    );
    await axeUtils.audit();
    await financialRemedyCourtPage.navigateContinue();
    await financialRemedyCourtPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ConsentedEvents.updateFrCourtInfo.listItem);

    await manageCaseDashboardPage.signOut();
  }
);
