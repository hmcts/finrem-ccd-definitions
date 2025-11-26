import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class ManageCaseDocumentsPage extends BaseJourneyPage {
  private readonly checkConfidentialityLabel: Locator;
  private readonly checkConfidentialDocumentTabLabel: Locator;
  private readonly checkConfidentialOneLabel: Locator;
  private readonly checkConfidentialTwoLabel: Locator;
  private readonly checkConfidentialThreeLabel: Locator;
  private readonly checkConfidentialFourLabel: Locator;
  readonly isThisFdrDocumentQuestion: Locator;
  private readonly addNewRadio: Locator;

  private readonly commonActionsHelper: CommonActionsHelper;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;

    this.checkConfidentialityLabel = page.getByText("Is the document confidential?");
    this.checkConfidentialDocumentTabLabel = page.getByText("Document will be placed in the confidential documents tab visible to caseworkers and judges only");
    this.checkConfidentialOneLabel = page.getByText("‘Confidential’ should only be selected for documents that you would never want to share with another party, for example a Form C8 for confidential address, or documents relating to a lock and key cases etc.");
    this.checkConfidentialTwoLabel = page.getByText("Do not use the confidential option to upload a document that you later intend to share as once confidential you will not be able to share it.");
    this.checkConfidentialThreeLabel = page.getByText("Do not select confidential if you are only waiting to exchange documents.");
    this.checkConfidentialFourLabel = page.getByText("Parties cannot see a document you upload until you formally share it with them within the portal UNLESS it is a FDR document, in which case they will be able to see it immediately without it being formally shared.");
    this.isThisFdrDocumentQuestion = page.getByText('Is this a Financial Dispute')
    this.addNewRadio = page.getByRole('radio', { name: 'Add New' })
  }

  // Legacy methods (to be removed once old Manage Case Documents event is gone)
  async legacyUploadDocument(documentName: string, collectionIndex: number = 0) {
    const uploadInput = this.page.getByRole('button', { name: 'Please upload any case' });
    await expect(uploadInput).toBeVisible();
    const filePayload = await this.commonActionsHelper.createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', documentName);
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, uploadInput, filePayload);
  }

  async legacyFillDescription(text: string) {
    const textArea = this.page.getByRole('textbox', { name: 'Provide the date of hearing' });
    await expect(textArea).toBeVisible();
    await textArea.fill(text);
  }

  async legacySelectDocumentType(optionText: string, collectionIndex: number = 0) {
    const dropdown = this.page.getByLabel('Document type', { exact: true })
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption({ label: optionText });
  }

  async legacySpecifyDocumentTypeIfOther(text: string, collectionIndex: number = 0) {
    const specifyInput = this.page.getByRole('textbox', { name: 'Please specify document type' })
    await expect(specifyInput).toBeVisible();
    await specifyInput.fill(text);
  }

  async legacyIsDocumentConfidential(isConfidential: boolean) {
    const yesRadio = this.page.getByRole('radio', { name: 'Yes' });
    const noRadio = this.page.getByRole('radio', { name: 'No' });
    const radio = isConfidential ? yesRadio : noRadio;
    await expect(radio).toBeVisible();
    await radio.check();
  }

  // New event methods
  async addNew(){
    await expect(this.addNewRadio).toBeVisible();
    await this.addNewRadio.check();
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

  getTextArea(collectionIndex: number): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_hearingDetails`);
  }

  getDocumentTypeDropdown(collectionIndex: number): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentType`);
  }

  getDocumentSpecify(collectionIndex: number): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentOther`);
  }

  async fillDescription(text: string, collectionIndex: number = 0) {
    const textArea = this.getTextArea(collectionIndex);
    await expect(textArea).toBeVisible();
    await textArea.fill(text);
  }

  async selectDocumentType(optionText: string, collectionIndex: number = 0) {
    const dropdown = this.getDocumentTypeDropdown(collectionIndex);
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption({ label: optionText });
  }

  async specifyDocumentTypeIfOther(text: string, collectionIndex: number = 0) {
    const specifyInput = this.getDocumentSpecify(collectionIndex);
    await expect(specifyInput).toBeVisible();
    await specifyInput.fill(text);
  }

  async checkConfidentialityGuideText() {
    await Promise.all([ 
      expect(this.checkConfidentialityLabel).toBeVisible(),
      expect(this.checkConfidentialDocumentTabLabel).toBeVisible(),
      expect(this.checkConfidentialOneLabel).toBeVisible(),
      expect(this.checkConfidentialTwoLabel).toBeVisible(),
      expect(this.checkConfidentialThreeLabel).toBeVisible(),
      expect(this.checkConfidentialFourLabel).toBeVisible(),
    ]);
  }

  getYesConfidentialRadio(collectionIndex: number = 0): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentConfidentiality_Yes`);
  }

  getNoConfidentialRadio(collectionIndex: number = 0): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentConfidentiality_No`);
  }

  async isDocumentConfidential(isConfidential: boolean, collectionIndex: number = 0) {
    const radio = isConfidential
      ? this.getYesConfidentialRadio(collectionIndex)
      : this.getNoConfidentialRadio(collectionIndex);
    await expect(radio).toBeVisible();
    await radio.check();

    if (isConfidential) {
      await expect(this.isThisFdrDocumentQuestion).toBeHidden();
    } else {
      await expect(this.isThisFdrDocumentQuestion).toBeVisible();
    }
  }

  getFdrYesRadio(collectionIndex: number = 0): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentFdr_Yes`);
  }

  getFdrNoRadio(collectionIndex: number = 0): Locator {
    return this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentFdr_No`);
  }

  async isThisAnFdrDocument(isFdrDocument: boolean, collectionIndex: number = 0) {
    await expect(this.isThisFdrDocumentQuestion).toBeVisible();
    const radio = isFdrDocument
      ? this.getFdrYesRadio(collectionIndex)
      : this.getFdrNoRadio(collectionIndex);
    await expect(radio).toBeVisible();
    await radio.check();
  }

  async documentOnBehalfOf(collectionIndex: number = 0, partyName: string) {
    const partySection = this.page.locator(`#inputManageCaseDocumentCollection_${collectionIndex}_caseDocumentParty`);
    await expect(partySection.getByText('Document on behalf of?')).toBeVisible();
    const partyRadio = partySection.getByText(partyName);
    await expect(partyRadio).toBeVisible();
    await partyRadio.click();
  }
}
