import {type Page, Locator, expect} from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper';

export class UploadOrderDocumentsPage extends BaseJourneyPage {

    private readonly variationOrderDocUpload: Locator;
    private readonly promptForAnyDocumentRadio: Locator
    private readonly promptForUrgentCaseQuestionRadio: Locator
    private readonly urgentCaseDetailsTextBox: Locator;

    private readonly consentOrderDocUpload: Locator;
    private readonly jointD81Radio: Locator;
    private readonly uploadJointD81: Locator;
    private readonly uploadD81Applicant: Locator;
    private readonly uploadD81Respondent: Locator;

    private readonly commonActionsHelper: CommonActionsHelper;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        
        this.variationOrderDocUpload = page.locator('#variationOrderDocument')
        this.promptForAnyDocumentRadio = page.locator('#promptForAnyDocument_radio')
        this.promptForUrgentCaseQuestionRadio = page.locator('#promptForUrgentCaseQuestion_radio')
        this.urgentCaseDetailsTextBox = page.locator('#urgentCaseQuestionDetailsTextArea');

        this.consentOrderDocUpload = page.locator('#consentOrder')
        this.jointD81Radio = page.locator('#d81Question')
        this.uploadJointD81 = page.locator('#d81Joint');

        this.uploadD81Applicant = page.locator('#d81Applicant');
        this.uploadD81Respondent = page.locator('#d81Respondent');
    }

    async uploadVariationOrderDoc() {
        let attempts = 0;
        while (attempts < 4) {
            await this.variationOrderDocUpload.setInputFiles('./playwright-e2e/resources/file/Variation order.pdf');
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
            await this.navigateContinue();
            const variationDocErrorMessage = this.page.getByText('Your request was rate limited. Please wait a few seconds before retrying your document upload');
            const isRateLimited = await variationDocErrorMessage.isVisible();
            if (!isRateLimited) {
                break;
            }
            await this.page.waitForTimeout(2500);
            await this.navigatePrevious();
            await this.navigateContinue();
            attempts++;
        }
        if (!(await this.variationOrderDocUpload.isVisible())) {
            await this.navigatePrevious();
        }
    }

    async selectUploadAdditionalDocs(uploadAdditionalDocs: Boolean){
        const radioOption = uploadAdditionalDocs ? 'Yes' : 'No'; 
        const optionToSelect = this.promptForAnyDocumentRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async uploadOtherDocuments(docFilename: string, docType: string, position: number = 0) {
        await this.navigateAddNew();

        const uploadOtherDocumentFiles = this.page
            .locator(`#uploadAdditionalDocument_${position}_additionalDocuments`);
        await expect(uploadOtherDocumentFiles).toBeVisible();

        const filePayload = await this.commonActionsHelper
            .createAliasPDFPayload('./playwright-e2e/resources/file/test.pdf', docFilename);
        await uploadOtherDocumentFiles.setInputFiles(filePayload);

        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);

        const docTypeDropdown = this.page.locator(`#uploadAdditionalDocument_${position}_additionalDocumentType`);
        await expect(docTypeDropdown).toBeVisible();
        await docTypeDropdown.selectOption(docType);
    }

    async selectUrgentCaseQuestionRadio(isUrgent: Boolean){
        const radioOption = isUrgent ? 'Yes' : 'No'; 
        const optionToSelect = this.promptForUrgentCaseQuestionRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async enterUrgentCaseDetails(urgentCaseDetails: string){
        await this.urgentCaseDetailsTextBox.fill(urgentCaseDetails);
    }

    async uploadConsentOrder(){
        // Wait for file upload rate limiter
        await this.consentOrderDocUpload.setInputFiles('./playwright-e2e/resources/file/Variation order.pdf');
        await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
    }

    async selectAndUploadJointD81(uploadJointD81: Boolean){
        const radioOption = uploadJointD81 ? 'Yes' : 'No'; 
        const optionToSelect = this.jointD81Radio.getByLabel(radioOption);
        await optionToSelect.check();
        if(uploadJointD81) {
            await this.uploadJointD81.setInputFiles('./playwright-e2e/resources/file/test.pdf');
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
        } else {
            await this.uploadD81Applicant.setInputFiles('./playwright-e2e/resources/file/test.pdf');
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
            await this.uploadD81Respondent.setInputFiles('./playwright-e2e/resources/file/test.pdf');
            await this.commonActionsHelper.waitForAllUploadsToBeCompleted(this.page);
        }
    }
}
