import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class ManageCaseDocumentsPage extends BaseJourneyPage {
  private readonly manageCaseDocumentHeading: Locator;
  private readonly uploadInput: Locator;
  private readonly textArea: Locator;
  private readonly documentTypeDropdown: Locator;
  private readonly documentSpecify: Locator;
  private readonly yesConfidentialRadio: Locator;
  private readonly noConfidentialRadio: Locator;
  private readonly uploadLabel: Locator;
  private readonly documentTypeLabel: Locator;
  private readonly checkSpecifyDocumentTypeLabel: Locator;
  private readonly checkFillDescriptionLabel: Locator;
  private readonly checkConfidentialityLabel: Locator;
  private readonly checkConfidentialDocumentTabLabel: Locator;
  private readonly checkConfidentialOneLabel: Locator;
  private readonly checkConfidentialTwoLabel: Locator;
  private readonly checkConfidentialThreeLabel: Locator;
  private readonly checkConfidentialFourLabel: Locator;
  private readonly uploadError: Locator;
  private readonly summaryUploadLabel: Locator;
  private readonly summaryUploadedFileLink: Locator;
  private readonly summaryDocumentTypeLabel: Locator;
  private readonly summarySpecifyDocTypeLabel: Locator;
  private readonly summaryDescriptionLabel: Locator;
  private readonly summaryConfidentialityLabel: Locator;
  private readonly summaryDocTypeValue: Locator;
  private readonly summarySpecifyDocTypeValue: Locator;
  private readonly summaryDescriptionValue: Locator;
  private readonly summaryConfidentialityValue: Locator; 

  private readonly commonActionsHelper: CommonActionsHelper;

  public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
    super(page);
    this.commonActionsHelper = commonActionsHelper;

    this.manageCaseDocumentHeading = page.getByRole('heading', { name: 'Manage case documents' });  
    this.uploadInput = page.locator('input[type="file"]'); 
    this.textArea = page.locator('#manageCaseDocumentCollection_0_hearingDetails'); 
    this.documentTypeDropdown = page.locator('#manageCaseDocumentCollection_0_caseDocumentType');
    this.documentSpecify = page.locator('#manageCaseDocumentCollection_0_caseDocumentOther')
    this.yesConfidentialRadio = page.getByRole('radio', { name: 'Yes' });
    this.noConfidentialRadio = page.getByLabel('No');
    this.uploadLabel = page.getByText("Please upload any case documents"); 
    this.documentTypeLabel = page.getByText('Document type', { exact: true }).first();
    this.checkSpecifyDocumentTypeLabel = page.getByLabel('Please specify document type');
    this.checkFillDescriptionLabel = page.getByLabel("Provide the date of hearing and a description of the document (optional)");
    this.checkConfidentialityLabel = page.getByText("Is the document confidential?");
    this.checkConfidentialDocumentTabLabel = page.getByText("Document will be placed in the confidential documents tab visible to caseworkers and judges only");
    this.checkConfidentialOneLabel = page.getByText("‘Confidential’ should only be selected for documents that you would never want to share with another party, for example a Form C8 for confidential address, or documents relating to a lock and key cases etc.");
    this.checkConfidentialTwoLabel = page.getByText("Do not use the confidential option to upload a document that you later intend to share as once confidential you will not be able to share it.");
    this.checkConfidentialThreeLabel = page.getByText("Do not select confidential if you are only waiting to exchange documents.");
    this.checkConfidentialFourLabel = page.getByText("Parties cannot see a document you upload until you formally share it with them within the portal UNLESS it is a FDR document, in which case they will be able to see it immediately without it being formally shared.");
    this.uploadError = page.getByText('Select or fill the required', { exact: false });
    this.summaryUploadLabel = page.getByText('Please upload any case documents');
    this.summaryUploadedFileLink = page.getByRole('link', { name: 'test.docx' }); 
    this.summaryDocumentTypeLabel = page.getByText('Document type', { exact: true }).first();
    this.summarySpecifyDocTypeLabel = page.getByText('Please specify document type');
    this.summaryDescriptionLabel = page.getByText('Provide the date of hearing and a description of the document');
    this.summaryConfidentialityLabel = page.getByText('Is the document confidential?');
    this.summaryDocTypeValue = page.getByText('Other', { exact: true }); 
    this.summarySpecifyDocTypeValue = page.getByText('test', { exact: true });
    this.summaryDescriptionValue = page.getByText('test case');
    this.summaryConfidentialityValue = page.getByText('Yes'); 
  } 

  // Upload a document
  async uploadDocument(filePath: string) {
    await expect(this.uploadLabel).toBeVisible();
    await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.uploadInput, filePath);
  }

  // Select document type
  async selectDocumentType(optionText: string) {
    await expect(this.documentTypeLabel).toBeVisible();
    await this.documentTypeDropdown.selectOption({ label: optionText });
  }
  
  // Specify document type
  async specifyDocumentType(text: string) {
    await expect(this.checkSpecifyDocumentTypeLabel).toBeVisible();
    await this.documentSpecify.fill(text);
  }

  // Fill in description
  async fillDescription(text: string) {
    await expect(this.checkFillDescriptionLabel).toBeVisible(); 
    await this.textArea.fill(text);
  }
  
  // Assertion
  async checkConfidentiality() {
    await Promise.all([ 
      expect(this.checkConfidentialityLabel).toBeVisible(),
      expect(this.checkConfidentialDocumentTabLabel).toBeVisible(),
      expect(this.checkConfidentialOneLabel).toBeVisible(),
      expect(this.checkConfidentialTwoLabel).toBeVisible(),
      expect(this.checkConfidentialThreeLabel).toBeVisible(),
      expect(this.checkConfidentialFourLabel).toBeVisible(),
    ]);
  }

  // Set confidentiality
  async setConfidentiality(isConfidential: boolean) {
    await (isConfidential ? this.yesConfidentialRadio : this.noConfidentialRadio).check();  
  }

  async checkAnswersPage() {
    await Promise.all([
      expect(this.summaryUploadLabel).toBeVisible(),
      expect(this.summaryUploadedFileLink).toBeVisible(),
      expect(this.summaryDocumentTypeLabel).toBeVisible(),
      expect(this.summaryDocTypeValue).toBeVisible(),
      expect(this.summarySpecifyDocTypeLabel).toBeVisible(),
      expect(this.summarySpecifyDocTypeValue).toBeVisible(),
      expect(this.summaryDescriptionLabel).toBeVisible(),
      expect(this.summaryDescriptionValue).toBeVisible(),
      expect(this.summaryConfidentialityLabel).toBeVisible(),
      expect(this.summaryConfidentialityValue).toBeVisible(),
    ]);
  }
}
