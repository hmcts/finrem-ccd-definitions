import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class CreateGeneralApplicationPage extends BaseJourneyPage {

    private readonly draftOrderUploadField: Locator;
    private readonly errorMessageLocator: Locator;
    private readonly commonActionsHelper: CommonActionsHelper;
    
    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.draftOrderUploadField = page.locator('#generalApplications_0_generalApplicationDraftOrder');
        this.errorMessageLocator = page.locator('text=Document format is not supported');
    }
    
    async uploadDraftOrder(uploadFilePath: string = './playwright-e2e/data/test.doc', success : boolean = true): Promise<void> {
        await this.draftOrderUploadField.setInputFiles(uploadFilePath);
        if (success) {
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
        } else {
            await this.errorMessageLocator.waitFor({ state: 'visible' });
        }
    }
    // <input type="file" class="form-control bottom-30" accept=".doc,.docx,.pdf" id="generalApplications_0_generalApplicationDocument">
    // <button _ngcontent-ng-c1715125381="" type="button" class="button write-collection-add-item__top">Add new</button>
    // <input type="file" class="form-control bottom-30" accept=".doc,.docx,.pdf" id="generalApplications_0_gaSupportDocuments_0_supportDocument">
}
