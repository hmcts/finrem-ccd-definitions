import { test } from '../../../fixtures/fixtures.ts';
import config from '../../../config/config.ts';
import { CommonEvents } from '../../../config/case-data.ts';
import { YesNoRadioEnum } from '../../../pages/helpers/enums/RadioEnums.ts';
import {
  contestedUpdateContactDetailsRespondentRepresentedAddressChangeTable, contestedUpdateContactDetailsTableData
} from '../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory.ts';
import { contestedUpdateContactDetailsRespondentRepresentedAddressChangeTabData, updateContestedApplicantRepresentedContactDetailsTabData } from '../../../resources/tab_content/contested/update_contact_details_represented.ts';
import {
  contestedUpdateContactDetailsTabData,
  contestedUpdateNonRefugeeContactDetailsTabData
} from '../../../resources/tab_content/contested/contested_update_contact_details_caseworker_tabs.ts';
import { contestedApplicantUpdateContactDetailsTableData } from '../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts';
import { contestedUpdateContactDetailsRespondentNotRepresentedTable } from '../../../resources/check_your_answer_content/update_contact_details/updateContactDetailsTable.ts';
import { updateContestedRespondentNonRepresentedContactDetailsTabData  } from '../../../resources/tab_content/contested/update_contact_details_not_represented.ts';
import { TestInfo } from 'playwright/test';

test(
  'Contested - Update Contact Details as a caseworker',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      createCaseCheckYourAnswersPage,
      checkYourAnswersPage
    }) => {
        
    // Create case and progress to HWF decision made
    const caseId = await ContestedCaseFactory.createContestedCaseUpToHWFDecision();

    const applicantInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;
    const respondentInRefuge: YesNoRadioEnum = YesNoRadioEnum.YES;

    // Login as caseworker and create case
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Update contact details
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.selectApplicantInRefuge(true);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.selectRespondentInRefuge(true);
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await createCaseCheckYourAnswersPage.checkApplicantInRefugeQuestion(applicantInRefuge);
    await createCaseCheckYourAnswersPage.checkRespondentInRefugeQuestion(respondentInRefuge);
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedUpdateContactDetailsTableData);

    await createCaseCheckYourAnswersPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(contestedUpdateContactDetailsTabData);
  }
);

test(
  'Contested - Update contact details - change in representation',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      checkYourAnswersPage
    }) => {
    // Create case and progress to HWF decision made
    const caseId = await ContestedCaseFactory.createContestedCaseUpToHWFDecision();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);

    // Update contact details
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
    await updateContactDetailsPage.checkApplicantRepresented(true);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.specifyContestedSolicitorName('Test Baggins'); 
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.specifyApplicantFirstName('Tester case');
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedApplicantUpdateContactDetailsTableData);
    await updateContactDetailsPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(updateContestedApplicantRepresentedContactDetailsTabData);

    // Update contact details and make respondent not represented
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
    await updateContactDetailsPage.checkRespondentRepresented(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.checkRepresentation(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.enterAddress('NW2 7NE');
    await updateContactDetailsPage.clickFindAddressButton();
    await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
    await updateContactDetailsPage.selectRespondentInRefuge(true);
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedUpdateContactDetailsRespondentNotRepresentedTable); 
    await updateContactDetailsPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(updateContestedRespondentNonRepresentedContactDetailsTabData);
  }
);

test(
  'Contested - Update contact details - change of address - without changing/removing representation details',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      checkYourAnswersPage
    }) => {
    // Create case and progress to HWF decision made
    const caseId = await ContestedCaseFactory.createContestedCaseUpToHWFDecision();

    // Login as caseworker
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(config.caseWorker.email, config.caseWorker.password, config.manageCaseBaseURL, config.loginPaths.worklist);
    await manageCaseDashboardPage.navigateToCase(caseId);
    
    // Update contact details and change respondent address without changing/removing representation details
    await caseDetailsPage.selectNextStep(CommonEvents.updateContactDetails);
    await updateContactDetailsPage.selectUpdateIncludesRepresentativeChange(true);
    await updateContactDetailsPage.checkRespondentRepresented(false);
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.checkRepresentation(true);
    await updateContactDetailsPage.enterAddress('NW2 7NE');
    await updateContactDetailsPage.clickFindAddressButton();
    await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
    await updateContactDetailsPage.navigateContinue();
    await updateContactDetailsPage.selectRespondentInRefuge(true);
    await updateContactDetailsPage.navigateContinue();

    //Continue about to submit and check your answers
    await checkYourAnswersPage.assertCheckYourAnswersPage(contestedUpdateContactDetailsRespondentRepresentedAddressChangeTable); 
    await updateContactDetailsPage.navigateSubmit();
    await caseDetailsPage.checkHasBeenUpdated(CommonEvents.updateContactDetails.listItem);

    // Assert tab data
    await caseDetailsPage.assertTabData(contestedUpdateContactDetailsRespondentRepresentedAddressChangeTabData);
  }
);

test(
  'Contested - Update contact details - applicant solicitor event',
  { tag: [] },
  async (
    {
      loginPage,
      manageCaseDashboardPage,
      caseDetailsPage,
      updateContactDetailsPage,
      checkYourAnswersPage,
      axeUtils
    },
    testInfo: TestInfo
  ): Promise<void> => {

    const caseId: string = await test.step(
      'Create contested case up to issue application',
      async () => {
        return await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      }
    );

    await test.step('Login as applicant solicitor and open case', async (): Promise<void> => {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        config.applicant_solicitor.email,
        config.applicant_solicitor.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );

      await manageCaseDashboardPage.navigateToCase(caseId);
    });

    await test.step('Select "Update contact details" event', async (): Promise<void> => {
      await caseDetailsPage.selectNextStep(
        CommonEvents.updateContactDetailsSolicitor
      );
    });

    await test.step('Fill in contact details form', async (): Promise<void> => {
      await updateContactDetailsPage.specifyContestedSolicitorName('John Marston');
      await updateContactDetailsPage.enterAddress('NW2 7NE');
      await updateContactDetailsPage.clickFindAddressButton();
      await updateContactDetailsPage.selectAddress('10 Selsdon Road, London');
      await updateContactDetailsPage.navigateContinue();
    });

    await test.step('Submit update contact details event', async (): Promise<void> => {
      await updateContactDetailsPage.navigateSubmit();
    });

    await test.step('Verify case has been updated', async (): Promise<void> => {
      await caseDetailsPage.checkHasBeenUpdated(
        'has been updated with event: Update Contact Details'
      );
    });

    await test.step('Verify tab data', async (): Promise<void> => {
      await caseDetailsPage.assertTabData(
        contestedUpdateNonRefugeeContactDetailsTabData
      );
    });
  }
);
