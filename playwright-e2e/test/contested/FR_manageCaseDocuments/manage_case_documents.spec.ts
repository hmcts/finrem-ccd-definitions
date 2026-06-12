import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {
  manageCaseDocumentsTableNewConfidential,
  manageCaseDocumentsTableNewNonConfidential,
  manageCaseDocumentsTableNonConfidentialWitnessSummons
} from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';

test.describe('Contested Manage Case Documents', () => {
  test(
    'Caseworker can add a non-confidential document',
    { tag: ['@caseworker'] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      caseDetailsPage,
      axeUtils,
      checkYourAnswersPage
    }) => {
      let caseId: string;

      await test.step('Create contested case', async () => {
        caseId =
                    await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      });

      await test.step('Login as caseworker', async () => {
        await manageCaseDashboardPage.visit();

        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
      });

      await test.step('Open manage case documents event', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(
          ContestedEvents.manageCaseDocuments
        );
      });

      await test.step('Upload non-confidential document', async () => {
        await manageCaseDocumentsPage.navigateAddNew();
        await manageCaseDocumentsPage.uploadCaseDocument('test.docx');
        await manageCaseDocumentsPage.selectDocument('Other');
        await manageCaseDocumentsPage.fillDocumentType('test document type');
        await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
        await manageCaseDocumentsPage.checkFdr(false);
        await manageCaseDocumentsPage.checkDocumentBehalfOfApplicant();
        await manageCaseDocumentsPage.navigateContinue();
      });

      await test.step('Verify check your answers summary', async () => {
        await checkYourAnswersPage.assertCheckYourAnswersPage(
          manageCaseDocumentsTableNewNonConfidential
        );
      });

      await test.step('Submit manage case documents event', async () => {
        await manageCaseDocumentsPage.navigateSubmit();
      });

      await test.step('Run accessibility audit', async () => {
        await axeUtils.audit();
      });
    }
  );

  test(
    'Caseworker can add a confidential document',
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      caseDetailsPage,
      axeUtils,
      checkYourAnswersPage
    }) => {
      let caseId: string;

      await test.step('Create contested case', async () => {
        caseId =
                    await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      });

      await test.step('Login as caseworker', async () => {
        await manageCaseDashboardPage.visit();

        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
      });

      await test.step('Open manage case documents event', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(
          ContestedEvents.manageCaseDocuments
        );
      });

      await test.step('Upload confidential document', async () => {
        await manageCaseDocumentsPage.navigateAddNew();
        await manageCaseDocumentsPage.uploadCaseDocument('test.docx');
        await manageCaseDocumentsPage.selectDocument('Other');
        await manageCaseDocumentsPage.fillDocumentType('test');
        await manageCaseDocumentsPage.checkConfidentiality('confidential');
        await manageCaseDocumentsPage.checkDocumentBehalfOfApplicant();
        await manageCaseDocumentsPage.navigateContinue();
      });

      await test.step('Verify check your answers summary', async () => {
        await checkYourAnswersPage.assertCheckYourAnswersPage(
          manageCaseDocumentsTableNewConfidential
        );
      });

      await test.step('Submit manage case documents event', async () => {
        await manageCaseDocumentsPage.navigateSubmit();
      });

      await test.step('Run accessibility audit', async () => {
        await axeUtils.audit();
      });
    }
  );

  test(
    'Caseworker can add a non-confidential witness summons document',
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      caseDetailsPage,
      axeUtils,
      checkYourAnswersPage
    }) => {
      let caseId: string;

      await test.step('Create contested case', async () => {
        caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      });

      await test.step('Login as caseworker', async () => {
        await manageCaseDashboardPage.visit();

        await loginPage.loginWaitForPath(
          config.caseWorker.email,
          config.caseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.worklist
        );
      });

      await test.step('Open manage case documents event', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(
          ContestedEvents.manageCaseDocuments
        );
      });

      await test.step(
        'Upload non-confidential witness summons document',
        async () => {
          await manageCaseDocumentsPage.navigateAddNew();

          await manageCaseDocumentsPage.uploadCaseDocument('test.docx');

          await manageCaseDocumentsPage.selectDocument(
            'Witness Summons'
          );

          await manageCaseDocumentsPage.checkConfidentiality(
            'non-confidential'
          );

          await manageCaseDocumentsPage.navigateContinue();
        }
      );

      await test.step('Verify check your answers summary', async () => {
        await checkYourAnswersPage.assertCheckYourAnswersPage(
          manageCaseDocumentsTableNonConfidentialWitnessSummons
        );
      });

      await test.step('Submit manage case documents event', async () => {
        await manageCaseDocumentsPage.navigateSubmit();
      });

      await test.step('Run accessibility audit', async () => {
        await axeUtils.audit();
      });
    }
  );

  test(
    'Super caseworker can amend an existing document',
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      page,
      caseDetailsPage,
      checkYourAnswersPage
    }) => {
      let caseId: string;

      await test.step(
        'Create contested case with existing document',
        async () => {
          caseId =
                        await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

          await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(
            caseId
          );
        }
      );

      await test.step('Login as super caseworker', async () => {
        await manageCaseDashboardPage.visit();

        await loginPage.loginWaitForPath(
          config.superCaseWorker.email,
          config.superCaseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
      });

      await test.step('Open manage case documents event', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(
          ContestedEvents.manageCaseDocuments
        );
      });

      await test.step('Open amend document flow', async () => {
        await manageCaseDocumentsPage.amendDoc();

        await expect(
          page.getByRole('button', { name: 'caseDoc.docx' })
        ).toBeVisible();
      });

      await test.step('Upload amended document', async () => {
        await manageCaseDocumentsPage.uploadDocument('test.docx');

        await manageCaseDocumentsPage.selectDocument(
          'Witness Summons'
        );

        await manageCaseDocumentsPage.checkConfidentiality(
          'non-confidential'
        );

        await manageCaseDocumentsPage.navigateContinue();
      });

      await test.step('Verify check your answers summary', async () => {
        await checkYourAnswersPage.assertCheckYourAnswersPage(
          manageCaseDocumentsTableNonConfidentialWitnessSummons
        );
      });

      await test.step('Submit amended document', async () => {
        await manageCaseDocumentsPage.navigateSubmit();
      });
    }
  );

  test(
    'Super caseworker can remove an existing document',
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      page,
      caseDetailsPage
    }) => {
      let caseId: string;

      await test.step(
        'Create contested case with existing document',
        async () => {
          caseId =
                        await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

          await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(
            caseId
          );
        }
      );

      await test.step('Login as super caseworker', async () => {
        await manageCaseDashboardPage.visit();

        await loginPage.loginWaitForPath(
          config.superCaseWorker.email,
          config.superCaseWorker.password,
          config.manageCaseBaseURL,
          config.loginPaths.cases
        );
      });

      await test.step('Open manage case documents event', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);

        await caseDetailsPage.selectNextStep(
          ContestedEvents.manageCaseDocuments
        );
      });

      await test.step('Open amend document flow', async () => {
        await manageCaseDocumentsPage.amendDoc();

        await expect(
          page.getByRole('button', { name: 'caseDoc.docx' })
        ).toBeVisible();
      });

      await test.step('Remove existing document', async () => {
        await manageCaseDocumentsPage.removeDocument();

        await manageCaseDocumentsPage.navigateContinue();
      });

      await test.step('Submit document removal', async () => {
        await manageCaseDocumentsPage.navigateSubmit();
      });

      await test.step(
        'Verify document has been removed from case file view',
        async () => {
          await caseDetailsPage.checkHasBeenUpdated(
            ContestedEvents.manageCaseDocuments.listItem
          );

          await caseDetailsPage.assertDocumentVisibleInCfv(
            'caseDoc.docx',
            false
          );
        }
      );
    }
  );
});