import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class CreateGeneralApplicationPage extends BaseJourneyPage {

    private readonly firstSupportingDocumentUploadField: Locator;
    private readonly draftOrderUploadField: Locator;
    private readonly generalApplicationUploadField: Locator;
    private readonly draftOrderErrorMessageLocator: Locator;
    private readonly generalApplicationErrorMessageLocator: Locator;
    private readonly firstSupportingDocumentErrorMessageLocator: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly addNewSupportingDocumentButton: Locator;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.draftOrderUploadField = page.locator('#generalApplications_0_generalApplicationDraftOrder');
        this.generalApplicationUploadField = page.locator('#generalApplications_0_generalApplicationDocument');
        this.firstSupportingDocumentUploadField = page.locator('#generalApplications_0_gaSupportDocuments_0_supportDocument');
        this.addNewSupportingDocumentButton = page.locator('#generalApplications_0_gaSupportDocuments').getByRole('button', { name: 'Add new' });

        this.draftOrderErrorMessageLocator = page.locator('label:has-text("Upload Draft Order (Optional)")').locator('xpath=following-sibling::*[contains(text(), "Document format is not supported")]');      
        this.generalApplicationErrorMessageLocator = page.locator('label:has-text("Upload General Application")').locator('xpath=following-sibling::*[contains(text(), "Document format is not supported")]');
        this.firstSupportingDocumentErrorMessageLocator = page.locator('label:has-text("Supporting Document (Optional)")').locator('xpath=following-sibling::*[contains(text(), "Document format is not supported")]');
    }

    private async uploadFile(locator: Locator, errorLocator: Locator, uploadFilePath: string, success: boolean): Promise<void> {
        await locator.setInputFiles(uploadFilePath);
        if (success) {
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
        } else {
            await errorLocator.waitFor({ state: 'visible' });
        }
    }

    async uploadDraftOrder(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.draftOrderUploadField, this.draftOrderErrorMessageLocator, uploadFilePath, success);
    }

    async uploadGeneralApplication(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.generalApplicationUploadField, this.generalApplicationErrorMessageLocator, uploadFilePath, success);
    }

    async uploadFirstSupportingDocument(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.firstSupportingDocumentUploadField, this.firstSupportingDocumentErrorMessageLocator, uploadFilePath, success);
    }

    async addNewSupportingDocument(): Promise<void> {
        await this.addNewSupportingDocumentButton.click();
    }
}
