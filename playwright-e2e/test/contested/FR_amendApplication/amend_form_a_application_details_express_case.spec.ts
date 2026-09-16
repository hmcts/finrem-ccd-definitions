import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { expressCaseGateKeepingTabData, expressCaseGateKeepingNotEnrolledTabData } from '../../../resources/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';
import { createCaseTabData } from '../../../resources/tab_content/contested/solicitor_create_case_tabs';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { SigninPage } from '../../../pages/SigninPage';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';

const enum ExpressTestType {
  TestingForExpressExit = 'Testing for content to say that the case is no longer express',
  TestingForExpressEntry = 'Testing for content to say that the case is express',
  TestForNoExpressContent = 'Testing that no content related to express is shown',
}

async function performAmendFormAApplicationDetailsFlowForExpressPilot(
  caseId: string,
  expressTestType: ExpressTestType,
  loginPage: SigninPage,
  manageCaseDashboardPage: ManageCaseDashboardPage,
  caseDetailsPage: CaseDetailsPage
): Promise<void> {
  await manageCaseDashboardPage.visit();
  await loginPage.loginWaitForPath(
    config.applicant_solicitor.email,
    config.applicant_solicitor.password,
    config.manageCaseBaseURL,
    config.loginPaths.cases
  );
  await manageCaseDashboardPage.navigateToCase(caseId);
  // Prior to testing, check tab data, mostly to ensure a page is showing with the event dropdown available.
  switch (expressTestType) {
  case ExpressTestType.TestingForExpressExit:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
    break;
  case ExpressTestType.TestingForExpressEntry:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
    break;
  case ExpressTestType.TestForNoExpressContent:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingNotEnrolledTabData);
    break;
  }
  let expressEnrolled: boolean;
  switch (expressTestType) {
  case ExpressTestType.TestingForExpressEntry:
    expressEnrolled = true;
    break;
  case ExpressTestType.TestingForExpressExit:
  case ExpressTestType.TestForNoExpressContent:
    expressEnrolled = false;
    break;
  }

  await ContestedEventApi.caseworkerPerformsAmendApplicationDetails(
    caseId,
    expressEnrolled
  );
  await manageCaseDashboardPage.navigateToCase(caseId);
  await caseDetailsPage.assertTabData(createCaseTabData); // Assert case creation tab data
  // Check the express part of the gatekeeping and allocation tab, depending on what you are testing
  switch (expressTestType) {
  case ExpressTestType.TestingForExpressExit:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingNotEnrolledTabData);
    break;
  case ExpressTestType.TestingForExpressEntry:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingTabData);
    break;
  case ExpressTestType.TestForNoExpressContent:
    await caseDetailsPage.assertTabData(expressCaseGateKeepingNotEnrolledTabData);
    break;
  }
}

test.describe('Contested - Amend Application Details join/exit express case Form A', () => {
  test(
    'Contested Form A - Amend Application Details. Exit Express Pilot content shown.  Amendment added a Variation Order, so criteria not met.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      }
    ) => {
      const caseId =
        await ContestedCaseFactory.createContestedFormACaseWithExpressPilotEnrolled();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestingForExpressExit,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      );
    }
  );

  test(
    'Contested Form A - Amend Application Details. Entering the Express Pilot content shown. The case still qualifies.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      }
    ) => {
      const caseId =
        await ContestedCaseFactory.createContestedFormACaseWithExpressPilotEnrolled();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestingForExpressEntry,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      );
    }
  );

  test(
    'Contested Form A - Amend Application Details. No Express Pilot content should be shown.  The case did not qualify before and still does not.',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      }
    ) => {
      const caseId = await ContestedCaseFactory.createBaseContestedFormA();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestForNoExpressContent,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage
      );
    }
  );
});
