import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class PeriodicalPaymentsPage extends BaseJourneyPage {

    private readonly periodicalPaymentsRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.periodicalPaymentsRadio = page.locator('#paymentForChildrenDecision_radio')
    }

    async selectPeriodicalPayments(periodicalPayment: boolean) {
        const radioOption = periodicalPayment ? 'Yes' : 'No'; 
        const optionToSelect = this.periodicalPaymentsRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
