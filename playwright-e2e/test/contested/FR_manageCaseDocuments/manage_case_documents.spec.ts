import { expect, test } from '../../../fixtures/fixtures';
import config from '../../../config/config';
import { ContestedEvents } from '../../../config/case-data';
import { ContestedCaseFactory } from '../../../data-utils/factory/contested/ContestedCaseFactory';
import { ContestedEventApi } from '../../../data-utils/api/contested/ContestedEventApi';
import { DocumentClient, DocumentMetadata } from '../../../data-utils/api/DocumentClient.ts';
import { CaseTab } from '../../../pages/ManageCaseDashboardPage.ts';
import { SigninPage } from '../../../pages/SigninPage';
import { ManageCaseDashboardPage } from '../../../pages/ManageCaseDashboardPage';
import { ManageCaseDocumentsPage } from '../../../pages/events/manage-case-documents/ManageCaseDocumentsPage';
import { CaseDetailsPage } from '../../../pages/CaseDetailsPage';
import { CheckYourAnswersPage } from '../../../pages/CheckYourAnswersPage';
import { AxeUtils } from '../../../fixtures/utils/axe-utils';
import { Table } from '../../../pages/components/table.ts';
import { Locator, Page } from '@playwright/test';
import {
  manageCaseDocumentsTableNewConfidential,
  manageCaseDocumentsTableNewNonConfidential,
  manageCaseDocumentsTableNonConfidentialWitnessSummons
} from '../../../resources/check_your_answer_content/manage_case_documents/manageCaseDocumentsTable';

const UPLOAD_FILENAME: string = 'test.docx';
const SEEDED_DOCUMENT_FILENAME: string = 'caseDoc.docx';

type Confidentiality = 'confidential' | 'non-confidential';

async function createContestedCaseStep(): Promise<string> {
  return test.step('Create contested case', async () => {
    return ContestedCaseFactory.createAndProcessFormACaseUpToIssueApplication();
  });
}

async function seedDocumentStep(caseId: string): Promise<void> {
  await test.step('Seed case with existing document', async () => {
    await ContestedEventApi.superCaseworkerAddDocManageCaseDocuments(caseId);
  });
}

async function loginAsCaseworkerStep(
  loginPage: SigninPage,
  manageCaseDashboardPage: ManageCaseDashboardPage
): Promise<void> {
  await test.step('Login as caseworker', async () => {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.caseWorker.email,
      config.caseWorker.password,
      config.manageCaseBaseURL,
      config.loginPaths.worklist
    );
  });
}

async function loginAsSuperCaseworkerStep(
  loginPage: SigninPage,
  manageCaseDashboardPage: ManageCaseDashboardPage
): Promise<void> {
  await test.step('Login as super caseworker', async () => {
    await manageCaseDashboardPage.visit();
    await loginPage.loginWaitForPath(
      config.superCaseWorker.email,
      config.superCaseWorker.password,
      config.manageCaseBaseURL,
      config.loginPaths.cases
    );
  });
}

async function openManageCaseDocumentsEventStep(
  manageCaseDashboardPage: ManageCaseDashboardPage,
  caseDetailsPage: CaseDetailsPage,
  caseId: string
): Promise<void> {
  await test.step('Open manage case documents event', async () => {
    await manageCaseDashboardPage.navigateToCase(caseId);
    await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
  });
}

async function uploadNewOtherDocumentStep(
  manageCaseDocumentsPage: ManageCaseDocumentsPage,
  options: {
    documentType: string;
    confidentiality: Confidentiality;
    includeFdr?: boolean;
  }
): Promise<void> {
  await test.step(`Upload ${options.confidentiality} document`, async () => {
    await manageCaseDocumentsPage.navigateAddNew();
    await manageCaseDocumentsPage.uploadCaseDocument(UPLOAD_FILENAME);
    await manageCaseDocumentsPage.selectDocument('Other');
    await manageCaseDocumentsPage.fillDocumentType(options.documentType);
    await manageCaseDocumentsPage.checkConfidentiality(options.confidentiality);

    if (options.includeFdr !== undefined) {
      await manageCaseDocumentsPage.checkFdr(options.includeFdr);
    }

    await manageCaseDocumentsPage.checkDocumentBehalfOfApplicant();
    await manageCaseDocumentsPage.navigateContinue();
  });
}

async function uploadNewWitnessSummonsStep(
  manageCaseDocumentsPage: ManageCaseDocumentsPage
): Promise<void> {
  await test.step('Upload non-confidential witness summons document', async () => {
    await manageCaseDocumentsPage.navigateAddNew();
    await manageCaseDocumentsPage.uploadCaseDocument(UPLOAD_FILENAME);
    await manageCaseDocumentsPage.selectDocument('Witness Summons');
    await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
    await manageCaseDocumentsPage.navigateContinue();
  });
}

async function openAmendDocumentFlowStep(
  manageCaseDocumentsPage: ManageCaseDocumentsPage,
  page: Page
): Promise<void> {
  await test.step('Open amend document flow', async () => {
    await manageCaseDocumentsPage.amendDoc();
    await expect(page.getByRole('link', { name: SEEDED_DOCUMENT_FILENAME })).toBeVisible();
  });
}

async function uploadAmendedWitnessSummonsStep(
  manageCaseDocumentsPage: ManageCaseDocumentsPage
): Promise<void> {
  await test.step('Upload amended document', async () => {
    await manageCaseDocumentsPage.uploadDocument(UPLOAD_FILENAME);
    await manageCaseDocumentsPage.selectDocument('Witness Summons');
    await manageCaseDocumentsPage.checkConfidentiality('non-confidential');
    await manageCaseDocumentsPage.navigateContinue();
  });
}

async function verifyCheckYourAnswersStep(
  checkYourAnswersPage: CheckYourAnswersPage,
  expectedContent: Table
): Promise<void> {
  await test.step('Verify check your answers summary', async () => {
    await checkYourAnswersPage.assertCheckYourAnswersPage(expectedContent);
  });
}

async function continueAndSubmitStep(
  manageCaseDocumentsPage: ManageCaseDocumentsPage,
  stepLabel: string
): Promise<void> {
  await test.step(stepLabel, async () => {
    await manageCaseDocumentsPage.navigateSubmit();
  });
}

async function runAccessibilityAuditStep(axeUtils: AxeUtils): Promise<void> {
  await test.step('Run accessibility audit', async () => {
    await axeUtils.audit();
  });
}

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
      const caseId = await createContestedCaseStep();

      await loginAsCaseworkerStep(loginPage, manageCaseDashboardPage);
      await openManageCaseDocumentsEventStep(manageCaseDashboardPage, caseDetailsPage, caseId);
      await uploadNewOtherDocumentStep(manageCaseDocumentsPage, {
        documentType: 'test document type',
        confidentiality: 'non-confidential',
        includeFdr: false
      });
      await verifyCheckYourAnswersStep(
        checkYourAnswersPage,
        manageCaseDocumentsTableNewNonConfidential
      );
      await continueAndSubmitStep(manageCaseDocumentsPage, 'Submit manage case documents event');
      await runAccessibilityAuditStep(axeUtils);
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
      const caseId = await createContestedCaseStep();

      await loginAsCaseworkerStep(loginPage, manageCaseDashboardPage);
      await openManageCaseDocumentsEventStep(manageCaseDashboardPage, caseDetailsPage, caseId);
      await uploadNewOtherDocumentStep(manageCaseDocumentsPage, {
        documentType: 'test',
        confidentiality: 'confidential'
      });
      await verifyCheckYourAnswersStep(
        checkYourAnswersPage,
        manageCaseDocumentsTableNewConfidential
      );
      await continueAndSubmitStep(manageCaseDocumentsPage, 'Submit manage case documents event');
      await runAccessibilityAuditStep(axeUtils);
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
      const caseId = await createContestedCaseStep();

      await loginAsCaseworkerStep(loginPage, manageCaseDashboardPage);
      await openManageCaseDocumentsEventStep(manageCaseDashboardPage, caseDetailsPage, caseId);
      await uploadNewWitnessSummonsStep(manageCaseDocumentsPage);
      await verifyCheckYourAnswersStep(
        checkYourAnswersPage,
        manageCaseDocumentsTableNonConfidentialWitnessSummons
      );
      await continueAndSubmitStep(manageCaseDocumentsPage, 'Submit manage case documents event');
      await runAccessibilityAuditStep(axeUtils);
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
      const caseId = await createContestedCaseStep();
      await seedDocumentStep(caseId);

      await loginAsSuperCaseworkerStep(loginPage, manageCaseDashboardPage);
      await openManageCaseDocumentsEventStep(manageCaseDashboardPage, caseDetailsPage, caseId);
      await openAmendDocumentFlowStep(manageCaseDocumentsPage, page);
      await uploadAmendedWitnessSummonsStep(manageCaseDocumentsPage);
      await verifyCheckYourAnswersStep(
        checkYourAnswersPage,
        manageCaseDocumentsTableNonConfidentialWitnessSummons
      );
      await continueAndSubmitStep(manageCaseDocumentsPage, 'Submit amended document');
    }
  );

  test(
    'Contested - Super Caseworker Manage Case Documents New event, amend event, delete existing document',
    { tag: [] },
    async ({
      loginPage,
      manageCaseDashboardPage,
      manageCaseDocumentsPage,
      page,
      caseDetailsPage
    }) => {
      const caseId = await createContestedCaseStep();
      await seedDocumentStep(caseId);

      await loginAsSuperCaseworkerStep(loginPage, manageCaseDashboardPage);
      await test.step('Navigate to case', async () => {
        await manageCaseDashboardPage.navigateToCase(caseId);
      });

      await test.step('Amend flow and delete existing document', async () => {
        await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
        await manageCaseDocumentsPage.amendDoc();

        const originalDocument = page.getByRole('link', { name: SEEDED_DOCUMENT_FILENAME });
        await expect(originalDocument).toBeVisible();

        await manageCaseDocumentsPage.removeDocument();
        await expect(originalDocument).toBeHidden({ timeout: 200 });

        await manageCaseDocumentsPage.navigateContinue();
        await manageCaseDocumentsPage.navigateSubmit();
      });

      await test.step('Verify document is removed from case file view', async () => {
        await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocuments.listItem);
        await caseDetailsPage.assertDocumentVisibleInCfv(SEEDED_DOCUMENT_FILENAME, false);
      });
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

    const caseId = await createContestedCaseStep();
    await seedDocumentStep(caseId);

    await loginAsSuperCaseworkerStep(loginPage, manageCaseDashboardPage);

    await test.step('Capture document ID from case data', async (): Promise<void> => {
      const responsePromise = page.waitForResponse(response => {
        return response.url().includes('/data/internal/cases/') && response.status() === 200;
      });

      await manageCaseDashboardPage.navigateToCase(caseId);
      await manageCaseDashboardPage.navigateToTab(CaseTab.ConfDocuments);

      const documentButton: Locator = page.getByRole('link', { name: SEEDED_DOCUMENT_FILENAME });
      await expect(documentButton).toBeVisible();

      const response = await responsePromise;
      const caseData: unknown = await response.json();
      const rawCaseData: string = JSON.stringify(caseData);
      const match: RegExpMatchArray | null = rawCaseData.match(/documents\/([a-f0-9-]+)\/binary/);

      expect(match).toBeTruthy();
      documentId = match![1];

      const cookies = await page.context().cookies();
      cookieHeader = cookies.map(cookie => {
        return `${cookie.name}=${cookie.value}`;
      }).join('; ');
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

    await test.step('Delete document via UI and submit event', async (): Promise<void> => {
      await caseDetailsPage.selectNextStep(ContestedEvents.manageCaseDocuments);
      await manageCaseDocumentsPage.amendDoc();
      await manageCaseDocumentsPage.removeDocument();
      await manageCaseDocumentsPage.navigateContinue();
      await manageCaseDocumentsPage.navigateSubmit();
    });

    await test.step('Assert document reference is removed from case documents tab', async (): Promise<void> => {
      await manageCaseDashboardPage.navigateToTab(CaseTab.CaseDocuments);
      const documentButton = page.getByRole('link', { name: SEEDED_DOCUMENT_FILENAME });
      await expect(documentButton).toHaveCount(0);
    });
  });

  test('Super caseworker can remove an existing document', async ({
    loginPage,
    manageCaseDashboardPage,
    manageCaseDocumentsPage,
    page,
    caseDetailsPage
  }) => {
    const caseId = await createContestedCaseStep();
    await seedDocumentStep(caseId);

    await loginAsSuperCaseworkerStep(loginPage, manageCaseDashboardPage);
    await openManageCaseDocumentsEventStep(manageCaseDashboardPage, caseDetailsPage, caseId);
    await openAmendDocumentFlowStep(manageCaseDocumentsPage, page);

    await test.step('Remove existing document', async () => {
      await manageCaseDocumentsPage.removeDocument();
      await manageCaseDocumentsPage.navigateContinue();
    });

    await continueAndSubmitStep(manageCaseDocumentsPage, 'Submit document removal');

    await test.step('Verify document has been removed from case file view', async () => {
      await caseDetailsPage.checkHasBeenUpdated(ContestedEvents.manageCaseDocuments.listItem);
      await caseDetailsPage.assertDocumentVisibleInCfv(SEEDED_DOCUMENT_FILENAME, false);
    });
  });
});
