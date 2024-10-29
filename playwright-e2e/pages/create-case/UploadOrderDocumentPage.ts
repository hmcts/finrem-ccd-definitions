import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class UploadOrderDocumentsPage extends BaseJourneyPage {

    private readonly variationOrderDocUpload: Locator;
    private readonly promptForAnyDocumentRadio: Locator
    private readonly promptForUrgentCaseQuestionRadio: Locator

    private readonly consentOrderDocUpload: Locator;
    private readonly jointD81Radio: Locator;
    private readonly uploadJointD81: Locator;

    public constructor(page: Page) {
        super(page);
        this.variationOrderDocUpload = page.locator('#variationOrderDocument')
        this.promptForAnyDocumentRadio = page.locator('#promptForAnyDocument_radio')
        this.promptForUrgentCaseQuestionRadio = page.locator('#promptForUrgentCaseQuestion_radio')

        this.consentOrderDocUpload = page.locator('#consentOrder')
        this.jointD81Radio = page.locator('#d81Question')
        this.uploadJointD81 = page.locator('#d81Joint');
    }

    async uploadVariationOrderDoc() {
        // Wait for file upload rate limiter
        await this.page.waitForTimeout(4000); 
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

    async uploadConsentOrder(){
        // Wait for file upload rate limiter
        await this.page.waitForTimeout(4000); 
        await this.consentOrderDocUpload.setInputFiles('./playwright-e2e/data/Variation order.pdf');
        await this.page.waitForTimeout(3000); 
    }

    async selectAndUploadJointD81(){
        const optionToSelect = this.jointD81Radio.getByLabel('Yes');
        await optionToSelect.check();
        await this.page.waitForTimeout(3000); 
        await this.uploadJointD81.setInputFiles('./playwright-e2e/data/test.pdf');
        await this.page.waitForTimeout(3000); 
    }
}
