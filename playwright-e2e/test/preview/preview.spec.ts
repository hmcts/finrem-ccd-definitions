import config from "../../config/config";
import { test } from "../../fixtures/fixtures";
import { createCaseTabData, createCaseTabDataPreview } from "../../resources/tab_content/consented/create_case_tabs";
import { ConsentedCaseFactory } from "../../data-utils/factory/consented/ConsentedCaseFactory";
import { ContestedCaseFactory } from "../../data-utils/factory/contested/ContestedCaseFactory";


test(
  'Consented Tab Verification',
  { tag: ['@preview'] },
  async (
    { 
    loginPage, 
    manageCaseDashboardPage, 
    caseDetailsPage 
  }
) => {
    const caseId = await ConsentedCaseFactory.createConsentedCaseUpToHWFDecision();
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabDataPreview);
  }
);

test(
  'Contested Tab Verification',
  { tag: ['@preview'] },
  async (
    { 
    loginPage, 
    manageCaseDashboardPage, 
    caseDetailsPage 
  }
) => {
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);
  }
);
