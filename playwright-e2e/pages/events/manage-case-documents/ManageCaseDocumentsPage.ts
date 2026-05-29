import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class ManageCaseDocumentsPage extends BaseJourneyPage {
  readonly isThisFdrDocumentQuestion: Locator;
  private readonly addNewRadio: Locator;
  private readonly amendRadio: Locator;
  private readonly fileUpload: Locator;
  private readonly documentType: Locator;
  private readonly documentSpecified: Locator;
  private readonly confidentialYesRadio: Locator;
  private readonly confidentialNoRadio: Locator;
  private readonly fdrYesRadio: Locator;
  private readonly fdrNoRadio: Locator;
  private readonly applicantRadio: Locator;



  private readonly commonActionsHelper: CommonActionsHelper;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;
    this.isThisFdrDocumentQuestion = page.getByText('Is this a Financial Dispute');
    this.addNewRadio = page.getByRole('radio', { name: 'Add New' });
    this.amendRadio = page.getByRole('radio', { name: 'Amend' });
    this.fileUpload = page.getByRole('button', { name: 'Please upload any case' });
    this.documentType = page.getByLabel('Document type', { exact: true });
    this.documentSpecified = page.getByRole('textbox', { name: 'Please specify document type' });
    this.confidentialYesRadio = page.getByRole('group', { name: 'Is the document confidential?' }).getByLabel('Yes');
    this.confidentialNoRadio = page.getByRole('group', { name: 'Is the document confidential?' }).getByLabel('No');
    this.fdrYesRadio = page.getByRole('group', { name: 'Is this a Financial Dispute' }).getByLabel('Yes');
    this.fdrNoRadio = page.getByRole('group', { name: 'Is this a Financial Dispute' }).getByLabel('No');
    this.applicantRadio = page.getByRole('radio', { name: 'Applicant' });
  }

  public async uploadCaseDocument(documentName: string): Promise<void> {
    await expect(this.fileUpload).toBeVisible();
    const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.fileUpload, filePayload);
  }
  public async selectDocument(option: string): Promise<void> {
    await expect(this.documentType).toBeVisible();
    await this.documentType.selectOption({ label: option });
  }

  public async fillDocumentType(description: string): Promise<void> {
    await expect(this.documentSpecified).toBeVisible();
    await this.documentSpecified.fill(description);
  }

  public async checkConfidentiality(option: 'confidential' | 'non-confidential'): Promise <void> {
    const radio: Locator =
        option === 'confidential'
          ? this.confidentialYesRadio
          : this.confidentialNoRadio;

    await radio.check();
  }

  public async checkFdr(option: true | false): Promise<void> {
    const radio: Locator =
        option ? this.fdrYesRadio : this.fdrNoRadio;
    await radio.check();
  }

  public async checkDocumentBehalfOfApplicant(): Promise<void> {
    await expect(this.applicantRadio).toBeVisible();
    await this.applicantRadio.check();
  }

  async amendDoc() {
    await expect(this.amendRadio).toBeVisible();
    await this.amendRadio.check();
    await this.continueButton.click();
  }

  getUploadLabel(collectionIndex: number = 0): Locator {
    return this.page.getByLabel('Please upload any case').nth(collectionIndex);
  }

  getUploadInput(collectionIndex: number = 0): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocuments`);
  }

  async uploadDocument(documentName: string, collectionIndex: number = 0) {
    const uploadLabel = this.getUploadLabel(collectionIndex);
    const uploadInput = this.getUploadInput(collectionIndex);
    await expect(uploadLabel).toBeVisible();
    const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, uploadInput, filePayload);
  }

  async removeDocument(collectionIndex: number = 0) {
    const buttonName = collectionIndex === 0
      ? 'Remove Add new case document(s)'
      : `Remove Add new case document(s) ${collectionIndex + 1}`;
    const removeButton = this.page.getByRole('button', { name: buttonName, exact: true });
    await expect(removeButton).toBeVisible();
    await removeButton.click();
    await expect(this.page.getByRole('heading', { name: 'Are you sure you want to remove the item?' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Remove' }).click();
  }

  async navigateAddNew(): Promise<void> {
    await this.addNewRadio.check();
    await this.continueButton.click();
  }
}
