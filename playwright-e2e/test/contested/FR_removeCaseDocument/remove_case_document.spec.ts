import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { CaseDocumentsTabOnlineFormANotPresentTabData, CaseDocumentsTabOnlineFormAPresentTabData } from '../../../resources/tab_content/common-tabs/case_documents_tab';

test(
  'Contested - Remove Case Document',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      removeCaseDocumentPage, 
      axeUtils
    }) => {

    // Create case and progress to Issue Application
    const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

    // Login as caseworker and navigate to case
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // assert OnlineForm.pdf is present in case documents tab before removing
    await caseDetailsPage.assertTabData(CaseDocumentsTabOnlineFormAPresentTabData);

    // Navigate to Remove Case Document event
    await caseDetailsPage.selectNextStep(ContestedEvents.removeCaseDocument);

    //remove document
    await removeCaseDocumentPage.verifyRemoveCaseDocumentPageDisplayed();
    await removeCaseDocumentPage.removeDocument(1); // remove OnlineForm.pdf document
    await removeCaseDocumentPage.assertAreYouSureYouWantToRemoveDocumentMessageIsDisplayed();
    await axeUtils.audit();
    await removeCaseDocumentPage.navigateContinue();

    // submit event
    await removeCaseDocumentPage.navigateSubmit();

    // assert OnlineForm.pdf is no longer present in case documents tab after removing
    await caseDetailsPage.assertTabDataNotVisible(CaseDocumentsTabOnlineFormANotPresentTabData);

  });

