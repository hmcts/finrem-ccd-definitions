import { BaseJourneyPage } from "../../BaseJourneyPage";

import { Page, Locator } from 'playwright';
import {expect} from "@playwright/test";

export class PaymentPage extends BaseJourneyPage {
    private pbaNumberTxtBox: Locator;
    private referenceTxtBox: Locator;
    
    public constructor(page: Page) {
        super(page);
        this.pbaNumberTxtBox = page.getByLabel('Enter your account number');
        this.referenceTxtBox = page.getByLabel('Enter your reference');
    }

    async enterPaymentDetails(pbaNumber: string, reference: string) {
        await this.pbaNumberTxtBox.fill(pbaNumber);
        await this.referenceTxtBox.fill(reference);
    }

    async assertErrorMessageMandatoryFields() {
        const errorMessages = [
            'Enter your account number is required',
            'Enter your reference is required'
        ];
        await this.navigateContinue();
        await this.assertErrorMessage(errorMessages);
    }

    async assertAmountToPay(amount: string = '£313.00') {
        const amountLocator = this.page.locator('dt.case-field__label', { hasText: 'Amount to pay' })
            .locator('xpath=../dd//span[contains(@class, "text-16")]');
        await expect(amountLocator).toHaveText(amount);
    }
}
