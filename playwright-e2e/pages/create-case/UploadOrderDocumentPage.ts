import { type Page, Locator } from '@playwright/test';

export class UploadOrderDocumentsPage {
    readonly page: Page;

    readonly variationOrderDocUpload: Locator;
    readonly promptForAnyDocumentRadio: Locator
    readonly promptForUrgentCaseQuestionRadio: Locator

    public constructor(page: Page) {
        this.page = page;

        this.variationOrderDocUpload = page.locator('#variationOrderDocument')
        this.promptForAnyDocumentRadio = page.locator('#promptForAnyDocument_radio')
        this.promptForUrgentCaseQuestionRadio = page.locator('#promptForUrgentCaseQuestion_radio')
    }

    async uploadVariationOrderDoc() {
        // Wait for file upload rate limiter
        await this.page.waitForTimeout(3000); 
        await this.variationOrderDocUpload.setInputFiles('./playwright-e2e/data/Variation order.pdf');
        await this.page.waitForTimeout(3000); 
    }

    async selectUploadAdditionalDocs(uploadAdditionalDocs: Boolean){
        const radioOption = uploadAdditionalDocs ? 'Yes' : 'No'; 
        const optionToSelect = this.promptForAnyDocumentRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectUrgentCaseQuestionRadio(isUrgent: Boolean){
        const radioOption = isUrgent ? 'Yes' : 'No'; 
        const optionToSelect = this.promptForUrgentCaseQuestionRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}