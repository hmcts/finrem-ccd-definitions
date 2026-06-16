import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import {DateHelper} from '../../../data-utils/DateHelper';
import {
  amendedDocumentTabData,
  getConfidentialDocumentsTabData,
  getFdrDocumentsTabData,
  getSpecialTypeConfidentialDocumentsTabData,
  getWithoutPrejudiceDocumentsTabData
} from '../../../resources/tab_content/contested/manage_case_documents_tabs';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { DocumentClient, DocumentMetadata } from '../../../data-utils/api/DocumentClient.ts';
import { CaseTab } from '../../../pages/ManageCaseDashboardPage.ts';
import { Locator } from '@playwright/test';
import {
  manageCaseDocumentsTableNewConfidential,
  manageCaseDocumentsTableNewNonConfidential,
  manageCaseDocumentsTableNonConfidentialWitnessSummons
} from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';

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
          page.getByRole('link', { name: 'caseDoc.docx' })
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

  test('Contested - Super Caseworker Manage Case Documents New event, amend event, delete existing document', 
    { tag: [] },
    async ({ loginPage, manageCaseDashboardPage, manageCaseDocumentsPage, page, caseDetailsPage, axeUtils, checkYourAnswersPage }) => {
      // Create and setup case
      const caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);

      // Login as super caseworker and navigate to case
      await manageCaseDashboardPage.visit();
      await loginPage.loginWaitForPath(config.superCaseWorker.email, config.superCaseWorker.password, config.manageCaseBaseURL, config.loginPaths.cases);
      await manageCaseDashboardPage.navigateToCase(caseId);

      // Manage case documents - amend document
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.amendDoc();

      //expect original document to be visible
      await expect(page.getByRole('link', { name: 'caseDoc.docx' })).toBeVisible();
      await manageCaseDocumentsPage.removeDocument();
      await expect(page.getByRole('link', { name: 'caseDoc.docx' })).toBeHidden({ timeout: 200 });
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();

      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocuments.listItem);
      await caseDetailsPage.assertDocumentVisibleInCfv('caseDoc.docx', false);
    }
  );

  test('Contested - Document deletion removes reference from Case Data', async ({
    page,
    manageCaseDashboardPage,
    loginPage,
    caseDetailsPage,
    manageCaseDocumentsPage
  }): Promise<void> => {
    let documentId: string;
    let cookieHeader: string;
    let caseId: string;

    const filename: string = 'caseDoc.docx';

    await test.step('Create case and seed document', async (): Promise<void> => {
      caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
      await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);
    });

    await test.step('Login and navigate to case', async ():Promise<void> => {
      await manageCaseDashboardPage.visit();

      await loginPage.loginWaitForPath(
        config.superCaseWorker.email,
        config.superCaseWorker.password,
        config.manageCaseBaseURL,
        config.loginPaths.cases
      );
    });

    await test.step('Capture document ID from case data', async (): Promise<void> => {
      const responsePromise = page.waitForResponse(res =>
      {return res.url().includes('/data/internal/cases/') &&
                res.status() === 200;}
      );

      await manageCaseDashboardPage.navigateToCase(caseId);
      await manageCaseDashboardPage.navigateToTab(CaseTab.ConfDocuments);

      const documentButton: Locator = page.getByRole('link', { name: filename });

      await expect(documentButton).toBeVisible();

      const response = await responsePromise;
      const caseData: JSON = await response.json();
      const raw: string = JSON.stringify(caseData);
      const match: RegExpMatchArray | null = raw.match(/documents\/([a-f0-9-]+)\/binary/);

      expect(match).toBeTruthy();
      documentId = match![1];

      const cookies = await page.context().cookies();
      cookieHeader = cookies.map(c => {return `${c.name}=${c.value}`;}).join('; ');
    });

    await test.step('Verify document exists before deletion', async (): Promise<void> => {
      const documentClient = new DocumentClient(
        config.superCaseWorker.email,
        config.superCaseWorker.password
      );

      const metadata: DocumentMetadata = await documentClient.getDocumentCookies(documentId, cookieHeader);

      expect(metadata).toBeTruthy();
      expect(metadata._links.self.href).toContain(documentId);
    });

    await test.step('Delete the document via UI', async (): Promise<void> => {
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.amendDoc();
      await manageCaseDocumentsPage.removeDocument();
    });

    await test.step('Submit event and verify response', async (): Promise<void> => {
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();
    });

    await test.step('Re-fetch case data and assert document reference removed', async (): Promise<void> => {
      await manageCaseDashboardPage.navigateToTab(CaseTab.CaseDocuments);
      const documentButton = page.getByRole('link', { name: filename});
      const noDocuments: number = 0;
      await expect(documentButton).toHaveCount(noDocuments);
    });
  });
});

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
        caseId = await ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();

        await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(
          caseId
        );
      });

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
        page.getByRole('link', {name: 'caseDoc.docx'})
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
  });
