import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class CreateGeneralApplicationPage extends BaseJourneyPage {

    private readonly firstSupportingDocumentUploadField: Locator;
    private readonly draftOrderUploadField: Locator;
    private readonly generalApplicationUploadField: Locator;
    private readonly errorMessageLocator: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly addNewSupportingDocumentButton: Locator;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.draftOrderUploadField = page.locator('#generalApplications_0_generalApplicationDraftOrder');
        this.generalApplicationUploadField = page.locator('#generalApplications_0_generalApplicationDocument');
        this.errorMessageLocator = page.locator('text=Document format is not supported');
        this.addNewSupportingDocumentButton = page.locator('#generalApplications_0_gaSupportDocuments').getByRole('button', { name: 'Add new' });
        this.firstSupportingDocumentUploadField = page.locator('#generalApplications_0_gaSupportDocuments_0_supportDocument');
    }

    private async uploadFile(locator: Locator, uploadFilePath: string, success: boolean): Promise<void> {
        await locator.setInputFiles(uploadFilePath);
        if (success) {
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
        } else {
            await this.errorMessageLocator.waitFor({ state: 'visible' });
        }
    }

    async uploadDraftOrder(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.draftOrderUploadField, uploadFilePath, success);
    }

    async uploadGeneralApplication(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.generalApplicationUploadField, uploadFilePath, success);
    }

    async uploadFirstSupportingDocument(uploadFilePath: string = './playwright-e2e/data/test.doc', success: boolean = true): Promise<void> {
        await this.uploadFile(this.firstSupportingDocumentUploadField, uploadFilePath, success);
    }

    async addNewSupportingDocument(): Promise<void> {
        await this.addNewSupportingDocumentButton.click();
    }
}
