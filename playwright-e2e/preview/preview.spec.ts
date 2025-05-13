import { test } from '../fixtures/fixtures';
import config from '../config/config';
import { ConsentedCaseHelper } from '../functional/helpers/Consented/ConsentedCaseHelper';
import { ContestedCaseHelper } from '../functional/helpers/Contested/ContestedCaseHelper';
import { createCaseTabData } from '../data/tab_content/contested/solicitor_create_case_tabs';
import { createCaseTabDataPreview } from '../data/tab_content/consented/create_case_tabs';

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
    const caseId = await ConsentedCaseHelper.createConsentedCaseUpToHWFDecision();
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
    const caseId = await ContestedCaseHelper.createAndProcessFormACaseUpToIssueApplication();
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);
  }
);
