import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class CreateGeneralApplicationPage extends BaseJourneyPage {
    static selectHearing(arg0: boolean) {
        throw new Error('Method not implemented.');
    }

    private readonly firstSupportingDocumentUploadField: Locator;
    private readonly draftOrderUploadField: Locator;
    private readonly generalApplicationUploadField: Locator;
    private readonly draftOrderErrorMessageLocator: Locator;
    private readonly generalApplicationErrorMessageLocator: Locator;
    private readonly firstSupportingDocumentErrorMessageLocator: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly addNewSupportingDocumentButton: Locator;
    private readonly yesRadio: Locator;
    private readonly noRadio: Locator;
    private readonly uploadGeneralLabel: Locator;
    private readonly uploadInput: Locator;
    private readonly checkTimeEstimateLabel: Locator;
    private readonly textArea: Locator;

    private static readonly DOCUMENT_FORMAT_ERROR_MESSAGE = "Document format is not supported";
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.draftOrderUploadField = page.locator('#generalApplications_0_generalApplicationDraftOrder');
        this.generalApplicationUploadField = page.locator('#generalApplications_0_generalApplicationDocument');
        this.firstSupportingDocumentUploadField = page.locator('#generalApplications_0_gaSupportDocuments_0_supportDocument');
        this.addNewSupportingDocumentButton = page.locator('#generalApplications_0_gaSupportDocuments').getByRole('button', { name: 'Add new' });

        this.draftOrderErrorMessageLocator = page.locator('label:has-text("Upload Draft Order (Optional)")').locator(`xpath=following-sibling::*[contains(text(), "${CreateGeneralApplicationPage.DOCUMENT_FORMAT_ERROR_MESSAGE}")]`);      
        this.generalApplicationErrorMessageLocator = page.locator('label:has-text("Upload General Application")').locator(`xpath=following-sibling::*[contains(text(), "${CreateGeneralApplicationPage.DOCUMENT_FORMAT_ERROR_MESSAGE}")]`);
        this.firstSupportingDocumentErrorMessageLocator = page.locator('label:has-text("Supporting Document (Optional)")').locator(`xpath=following-sibling::*[contains(text(), "${CreateGeneralApplicationPage.DOCUMENT_FORMAT_ERROR_MESSAGE}")]`);

        this.yesRadio = page.locator('#generalApplications_0_generalApplicationHearingRequired_Yes');
        this.noRadio = page.locator('#generalApplications_0_generalApplicationHearingRequired_No');
        this.uploadGeneralLabel = page.getByText("Please upload a copy of the application as a Word, PDF, or Excel document (Word/Excel documents will be converted to PDF after submission).");
        this.uploadInput = page.locator('#generalApplications_0_generalApplicationDocument'); 
        this.textArea = page.locator('#generalApplications_0_generalApplicationTimeEstimate');
        this.checkTimeEstimateLabel = page.getByLabel('Time estimate');
    }

    private async uploadFile(locator: Locator, errorLocator: Locator, uploadFilePath: string, success: boolean): Promise<void> {
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, locator, uploadFilePath, 5, 5000);
        if (success) {
            await expect(errorLocator).toBeHidden();
        } else {
            await expect(errorLocator).toBeVisible();
        }
    }

    async uploadDraftOrder(uploadFilePath: string = './playwright-e2e/resources/file/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.draftOrderUploadField, this.draftOrderErrorMessageLocator, uploadFilePath, success);
    }

    async uploadGeneralApplication(uploadFilePath: string = './playwright-e2e/resources/file/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.generalApplicationUploadField, this.generalApplicationErrorMessageLocator, uploadFilePath, success);
    }

    async uploadFirstSupportingDocument(uploadFilePath: string = './playwright-e2e/resources/file/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.firstSupportingDocumentUploadField, this.firstSupportingDocumentErrorMessageLocator, uploadFilePath, success);
    }

    async addNewSupportingDocument(): Promise<void> {
        await this.addNewSupportingDocumentButton.click();
    }

    async selectHearing(isConfidential: boolean) {
        await (isConfidential ? this.yesRadio : this.noRadio).check(); 
    }

    async uploadGeneralDocument(filePath: string) {
        await expect(this.uploadGeneralLabel).toBeVisible();
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.uploadInput, filePath);
  }

    async fillTimeEstimate(text: string) {
        await expect(this.checkTimeEstimateLabel).toBeVisible(); 
        await this.textArea.fill(text);
  }
}
