import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEvents } from '../../../config/case-data';
import { updateSchedulingAndListingTabData } from '../../../resources/tab_content/contested/scheduling_and_listing_tab';

test.describe('Contested - Ready For Hearing', () => {
  test(
    'Form A case up to List for Hearing and Submit Uploaded Case Files',
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        submitUploadedCaseFilesPage,
      }
    ) => {
        
    const caseId = await ContestedCaseFactory.progressToUploadDraftOrder({ isFormA: true });
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Submit Uploaded Case Files 
    await caseDetailsPage.selectNextStep(ContestedEvents.submitUploadedCaseFiles);
    await submitUploadedCaseFilesPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.submitUploadedCaseFiles.listItem);
    await caseDetailsPage.assertTabData(updateSchedulingAndListingTabData);
  });
});
