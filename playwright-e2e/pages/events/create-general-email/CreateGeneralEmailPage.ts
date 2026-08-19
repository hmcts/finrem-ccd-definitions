import { expect, Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper.js';

export class CreateGeneralEmailPage extends BaseJourneyPage {
  private readonly commonActionsHelper: CommonActionsHelper;
  private readonly recipientEmailBox: Locator;
  private readonly bodyofEmailBox: Locator;
  private readonly optionalUploadDocument: Locator;
  private readonly addNewDocumentButton: Locator

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;
    this.recipientEmailBox = page.getByRole('textbox', { name: 'Recipient\'s email' });
    this.bodyofEmailBox = page.getByRole('textbox', { name: 'Please fill in the body of' });
    this.optionalUploadDocument = page.locator('#generalEmailUploadedDocuments_0 input[type="file"]');
    this.addNewDocumentButton = page.getByRole('button', { name: 'Add new' }).first();
  }

  async enterReceipientEmail(email: string) {
    expect(this.recipientEmailBox).toBeVisible();
    await this.recipientEmailBox.fill(email);
  }

  async enterBodyOfEmail(body: string) {
    expect(this.bodyofEmailBox).toBeVisible();
    await this.bodyofEmailBox.fill(body);
  }
  async uploadDocument(filePath: string) {
    this.addNewDocumentButton.click();
    expect(this.optionalUploadDocument).toBeVisible();
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.optionalUploadDocument, filePath);
  }
}

