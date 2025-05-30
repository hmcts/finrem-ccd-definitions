import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ManageCaseDocumentsPage extends BaseJourneyPage {
  private readonly manageCaseDocumentHeading: Locator;
  private readonly uploadInput: Locator;
  private readonly textArea: Locator;
  private readonly documentTypeDropdown: Locator;
  private readonly yesConfidentialRadio: Locator;
  private readonly noConfidentialRadio: Locator;

  public constructor(page: Page) {
    super(page);
    this.manageCaseDocumentHeading = page.getByRole('heading', { name: 'Manage case documents' });  
    this.uploadInput = page.locator('input[type="file"]'); 
    this.textArea = page.locator('test case'); 
    this.documentTypeDropdown = page.locator('select');
    this.yesConfidentialRadio = page.getByLabel('Yes'); 
    this.noConfidentialRadio = page.getByLabel('No');
  } 

  // Upload a document
  async uploadDocument(filePath: string) {
    await this.uploadInput.setInputFiles(filePath);
  }

  // Select document type
  async selectDocumentType(optionText: string) {
    await this.documentTypeDropdown.selectOption({ label: optionText });
  }

  // Fill in description
  async fillDescription(text: string) {
    await this.textArea.fill(text);
  }

  // Set confidentiality
  async setConfidentiality(isConfidential: boolean) {
    await (isConfidential ? this.yesConfidentialRadio : this.noConfidentialRadio).check();  
  }
}
