import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class PeriodicalPaymentsPage extends BaseJourneyPage {

    private readonly periodicalPaymentsRadioContested: Locator;

    private readonly periodicalPaymentsRadioConsented: Locator;

    public constructor(page: Page) {
        super(page);
        this.periodicalPaymentsRadioContested = page.locator('#paymentForChildrenDecision_radio')

        this.periodicalPaymentsRadioConsented = page.locator('#orderForChildrenQuestion1_radio')
    }

    async selectPeriodicalPaymentsContested(periodicalPayment: boolean) {
        const radioOption = periodicalPayment ? 'Yes' : 'No'; 
        const optionToSelect = this.periodicalPaymentsRadioContested.getByLabel(radioOption);
        await optionToSelect.check();
    }

    async selectPeriodicalPaymentsConsented(periodicalPayment: boolean) {
        const radioOption = periodicalPayment ? 'Yes' : 'No'; 
        const optionToSelect = this.periodicalPaymentsRadioConsented.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
