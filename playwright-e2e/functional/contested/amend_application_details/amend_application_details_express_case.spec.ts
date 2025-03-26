import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { createCaseInCcd, updateCaseInCcd } from '../../../../test/helpers/utils';
import { contestedEvents } from '../../../config/case_events';

async function createAndProcessFormACase(): Promise<string> {
  const caseId = await createCaseInCcd(config.applicant_solicitor.email, config.applicant_solicitor.password, './playwright-e2e/data/payload/contested/forma/ccd-contested-express-case-creation.json', 'FinancialRemedyContested', 'FR_solicitorCreate');
  return caseId;
}

async function performAmendApplicationDetailsFlow(
  caseId: string,
  loginPage: any,
  manageCaseDashboardPage: any,
  caseDetailsPage: any,
  startPage: any,
  SolicitorDetailsPage: any,
  testInfo: any,
  makeAxeBuilder: any
): Promise<void> {
  await manageCaseDashboardPage.visit();
  await loginPage.login(config.applicant_solicitor.email, config.applicant_solicitor.password, config.manageCaseBaseURL);
  await manageCaseDashboardPage.navigateToCase(caseId);

  await caseDetailsPage.selectNextStep(contestedEvents.amendApplicationDetails);
  await startPage.navigateContinue();

  
}

test.describe('Contested - Amend Application Details express Form A', () => {
   test(
    'Contested - Amend Application Details express case (Form A)',
     { tag: [] },
     async (
       {
         loginPage,
         manageCaseDashboardPage,
         caseDetailsPage,
         startPage,
         solicitorDetailsPage,
         makeAxeBuilder,
       },
       testInfo
     ) => {
       const caseId = await createAndProcessFormACase();
       await performAmendApplicationDetailsFlow(caseId, loginPage, manageCaseDashboardPage, caseDetailsPage, startPage, solicitorDetailsPage, testInfo, makeAxeBuilder);
     }
   );
});
