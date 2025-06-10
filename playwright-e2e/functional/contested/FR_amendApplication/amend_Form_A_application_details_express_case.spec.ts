import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { expressCaseGateKeepingTabData, expressCaseGateKeepingNotEnrolledTabData } from '../../../data/tab_content/contested/gatekeeping_and_allocation/express_case_gatekeeping_tab';
import { createCaseTabData } from '../../../data/tab_content/contested/solicitor_create_case_tabs';
import { ExpressCasePage } from '../../../pages/events/amend-application-details/ExpressCasePage';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { StartPage } from '../../../pages/events/create-case/StartPage';
import { NatureOfApplicationPage } from '../../../pages/events/create-case/NatureOfApplicationPage';
import { UploadOrderDocumentsPage } from '../../../pages/events/create-case/UploadOrderDocumentPage';
import { CreateCaseCheckYourAnswersPage } from '../../../pages/events/create-case/CreateCaseCheckYourAnswersPage';
import { TestInfo } from 'playwright/test';
import { ContestedCaseDataHelper } from '../../data-utils/contested/ContestedCaseDataHelper';
import { SigninPage } from '../../../pages/SigninPage';

const enum ExpressTestType {
  TestingForExpressExit = "Testing for content to say that the case is no longer express",
  TestingForExpressEntry = "Testing for content to say that the case is express",
  TestForNoExpressContent = "Testing that no content related to express is shown",
}

async function performAmendFormAApplicationDetailsFlowForExpressPilot(
  caseId: string,
  expressTestType: ExpressTestType,
  loginPage: SigninPage,
  manageCaseDashboardPage: ManageCaseDashboardPage,
  caseDetailsPage: CaseDetailsPage,
  startPage: StartPage,
  natureOfApplicationPage: NatureOfApplicationPage,
  expressCasePage: ExpressCasePage,
  uploadOrderDocumentsPage: UploadOrderDocumentsPage,
  createCaseCheckYourAnswersPage: CreateCaseCheckYourAnswersPage,
  testInfo: TestInfo,
  makeAxeBuilder: any
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
  await caseDetailsPage.selectNextStep(ContestedEvents.amendFormAApplicationDetails);
  await startPage.navigateContinue();
  await startPage.navigateContinue(); // Applicant representation
  await startPage.navigateContinue(); // Divorce / Dissolution details
  await startPage.navigateContinue(); // Enter Applicant's name and address
  await startPage.navigateContinue(); // Enter respondent names
  await startPage.navigateContinue(); // Respondent's representation details
  // Nature of App - Select Variation order if testing that we exit Express Pilot
  if (ExpressTestType.TestingForExpressExit == expressTestType) {
    await natureOfApplicationPage.selectVariationOrderOnly();
  }
  await natureOfApplicationPage.navigateContinue();
  await startPage.navigateContinue(); // Select Fast Track No
  await startPage.navigateContinue(); // Complete complexity list and assets details
  await startPage.navigateContinue(); // Complete court details
  // Check the express page, depending on what you are testing
  switch (expressTestType) {
    case ExpressTestType.TestingForExpressExit:
      await expressCasePage.checkExitContent();
      await expressCasePage.navigateContinue();
      break;
    case ExpressTestType.TestingForExpressEntry:
      await expressCasePage.checkEnterContent();
      await expressCasePage.checkLinkResolves();
      await expressCasePage.navigateContinue();
      break;
    case ExpressTestType.TestForNoExpressContent:
      // no express page shown, test resumes from next page in journey.
      break;
  }
  await startPage.navigateContinue(); // Complete MIAM Yes/No
  await startPage.navigateContinue(); // Complete MIAM certification details
  await uploadOrderDocumentsPage.uploadVariationOrderDoc(); // Upload variation Order Document
  await uploadOrderDocumentsPage.navigateContinue();
  await uploadOrderDocumentsPage.navigateContinue();
  await createCaseCheckYourAnswersPage.navigateSubmit();
  await caseDetailsPage.checkHasBeenUpdated('Amend Application Details');
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

  if (config.run_accessibility) {
    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json'
    });

    expect(accessibilityScanResults.violations).toEqual([]);
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
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId =
        await ContestedCaseDataHelper.createContestedFormACaseWithExpressPilotEnrolled();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestingForExpressExit,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        testInfo,
        makeAxeBuilder
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
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId =
        await ContestedCaseDataHelper.createContestedFormACaseWithExpressPilotEnrolled();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestingForExpressEntry,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        testInfo,
        makeAxeBuilder
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
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        makeAxeBuilder,
      },
      testInfo
    ) => {
      const caseId = await ContestedCaseDataHelper.createBaseContestedFormA();
      await performAmendFormAApplicationDetailsFlowForExpressPilot(
        caseId,
        ExpressTestType.TestForNoExpressContent,
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        startPage,
        natureOfApplicationPage,
        expressCasePage,
        uploadOrderDocumentsPage,
        createCaseCheckYourAnswersPage,
        testInfo,
        makeAxeBuilder
      );
    }
  );
});
