import { test } from '../fixtures/fixtures';
import config from '../config/config';
import { createCaseTabData } from '../data/tab_content/contested/solicitor_create_case_tabs';
import { createCaseTabDataPreview } from '../data/tab_content/consented/create_case_tabs';
import { ConsentedCaseDataHelper } from '../functional/data-utils/consented/ConsentedCaseDataHelper';
import { ContestedCaseDataHelper } from '../functional/data-utils/contested/ContestedCaseDataHelper';

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
    const caseId = await ConsentedCaseDataHelper.createConsentedCaseUpToHWFDecision();
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
    const caseId = await ContestedCaseDataHelper.createAndProcessFormACaseUpToIssueApplication();
    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
    await manageCaseDashboardPage.navigateToCase(caseId);
    // Assert tab data
    await caseDetailsPage.assertTabData(createCaseTabData);
  }
);
