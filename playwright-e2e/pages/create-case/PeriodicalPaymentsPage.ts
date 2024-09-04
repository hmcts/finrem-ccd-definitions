import { type Page, Locator } from '@playwright/test';

export class PeriodicalPaymentsPage {
    readonly page: Page;

    readonly periodicalPaymentsRadio: Locator;

    public constructor(page: Page) {
        this.page = page

        this.periodicalPaymentsRadio = page.locator('#paymentForChildrenDecision_radio')
    }

    async selectPeriodicalPayments(periodicalPayment: boolean) {
        const radioOption = periodicalPayment ? 'Yes' : 'No'; 
        const optionToSelect = this.periodicalPaymentsRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}