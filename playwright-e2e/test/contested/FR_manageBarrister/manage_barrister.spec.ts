import { test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';

test(
    'Contested - Manage Barrister @test',
    { tag: [] },
    async (
      {
        loginPage,
        manageCaseDashboardPage,
        caseDetailsPage,
        manageBarristerPage,
        createCaseCheckYourAnswersPage,
        checkYourAnswersPage
      }) => {

        // Create case and progress to HWF decision made
        const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

        const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
        const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

            // Login as caseworker and navigate to case
            await manageCaseDashboardPage.visit();
            await loginPage.login(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL);
            await manageCaseDashboardPage.navigateToCase(caseId);
        // Update contact details
            await caseDetailsPage.selectNextStep(ContestedEvents.manageBarrister);
            await manageBarristerPage.checkApplicantRepresented(true);
            await manageBarristerPage.navigateContinue();
            await manageBarristerPage.clickAddNew();
            await manageBarristerPage.specifyBarristerFirstName('Tester Gollum');
            await manageBarristerPage.specifyBarristerEmail('fr_applicant_barrister1@mailinator.com');
            await manageBarristerPage.specifyBarristerOrganisation('Finrem-1-Org');
            await manageBarristerPage.clickSelectButton();
            await manageBarristerPage.navigateContinue();
    }
);