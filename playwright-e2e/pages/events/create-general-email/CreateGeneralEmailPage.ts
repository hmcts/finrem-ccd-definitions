import { expect, Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { CommonActionsHelper } from '../../helpers/CommonActionsHelper.js';

export class CreateGeneralEmailPage extends BaseJourneyPage {
    private readonly commonActionsHelper: CommonActionsHelper;
    private readonly recipientEmailBox: Locator;
    private readonly bodyofEmailBox: Locator;
    private readonly optionalUploadDocument: Locator;

    public constructor(page: Page, commonActionsHelper: CommonActionsHelper) {
        super(page);
        this.commonActionsHelper = commonActionsHelper;
        this.recipientEmailBox = page.getByRole('textbox', { name: 'Recipient\'s email' });
        this.bodyofEmailBox = page.getByRole('textbox', { name: 'Please fill in the body of' })
        this.optionalUploadDocument = page.getByRole('button', { name: 'Upload document' });
    }

    // SEE DFR-3942
    async enterInvalidEmailAddressAndSubmit(){
        expect(this.recipientEmailBox).toBeVisible();
        await this.recipientEmailBox.fill('test');
        await this.navigateContinue();
        await expect(this.page.getByText('test is not a valid Email address')).toBeVisible();
        
    }

    async enterReceipientEmail(email: string) {
        expect(this.recipientEmailBox).toBeVisible();
        await this.recipientEmailBox.fill(email);
    }

    async enterBodyOfEmail(body: string) {
        expect(this.bodyofEmailBox).toBeVisible();
        await this.bodyofEmailBox.fill(body);
    }
    async uploadDocument(filePath: string) {
        expect(this.optionalUploadDocument).toBeVisible();
        await this.commonActionsHelper.uploadWithRateLimitRetry(this.page, this.optionalUploadDocument, filePath)
    }
}

