import { BaseJourneyPage } from "../../BaseJourneyPage";

import { Page, Locator } from 'playwright';

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
}
