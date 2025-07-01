import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { manageApplicantBarristerApplicantTableData } from '../../../resources/check_your_answer_content/manage_barrister/manageBarristerTable.ts';
import { manageBarristerApplicantTabData } from '../../../resources/tab_content/contested/manage_barrister_applicant';
import { manageRespondentBarristerApplicantTableData } from '../../../resources/check_your_answer_content/manage_barrister/manageBarristerTable.ts';
import { manageBarristeRespondentTabData } from '../../../resources/tab_content/contested/manage_barrister_applicant.ts';

test(
    'Contested - Manage Barrister',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        manageBarristerPage,
        checkYourAnswersPage
      }) => {

        // Create case and progress to HWF decision made
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

        // Login as caseworker and navigate to case
        await manageCaseDashboardPage.visit();
        await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
        await manageCaseDashboardPage.navigateToCase(caseId);

        // Navigate to manage barrister and update applicant barrister
        await caseDetailsPage.selectNextStep(ContestedEvents.manageBarrister);
        await manageBarristerPage.checkApplicantRepresented(true);
        await manageBarristerPage.navigateContinue();
        await manageBarristerPage.clickAddNew();
        await manageBarristerPage.specifyApplicantBarristerFirstName('Tester Gollum');
        await manageBarristerPage.specifyApplicantBarristerEmail('fr_applicant_barrister1@mailinator.com');
        await manageBarristerPage.specifyBarristerOrganisation('Finrem-1-Org');
        await manageBarristerPage.clickSelectButton();
        await manageBarristerPage.navigateContinue();
        
        //Continue about to submit and check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(manageApplicantBarristerApplicantTableData);
        await manageBarristerPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageBarrister.listItem);

        // Assert tab data
        await caseDetailsPage.assertTabData(manageBarristerApplicantTabData);
        await manageBarristerPage.assertBarristerTabData();

        // Navigate to manage barrister and update respondent barrister
        await caseDetailsPage.selectNextStep(ContestedEvents.manageBarrister);
        await manageBarristerPage.checkRespondentRepresented(false);
        await manageBarristerPage.navigateContinue();
        await manageBarristerPage.clickAddNew();
        await manageBarristerPage.specifyRespondentBarristerFirstName('Frodo Test Baggins');
        await manageBarristerPage.specifyRespondentBarristerEmail('fr_res_barrister1@mailinator.com');
        await manageBarristerPage.specifyBarristerOrganisation('Finrem-2-Org');
        await manageBarristerPage.clickSelectButton();
        await manageBarristerPage.navigateContinue();

        //Continue about to submit and check your answers
        await checkYourAnswersPage.assertCheckYourAnswersPage(manageRespondentBarristerApplicantTableData);
        await manageBarristerPage.navigateSubmit();
        await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageBarrister.listItem);

        // Assert tab data
        await caseDetailsPage.assertTabData(manageBarristeRespondentTabData);
    }
);
