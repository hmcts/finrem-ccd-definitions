import {expect, Locator, Page} from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import {YesNoRadioEnum} from "../../helpers/enums/RadioEnums.ts";

export class HelpWithFeesPage extends BaseJourneyPage {
    private readonly paymentDetailsTitle: Locator;
    private helpWithFeesRadio: Locator;

    constructor(page: Page) {
        super(page);
        this.paymentDetailsTitle = page.getByRole('heading', { name: 'Payment details' });
        this.helpWithFeesRadio = page.locator('#helpWithFeesQuestion_radio');
    }

    async assertPaymentDetailsPage() {
        await this.page.waitForLoadState('load');
        await expect(this.paymentDetailsTitle).toBeVisible();
    }

    async selectHelpWithFees(yesOrNo: YesNoRadioEnum) {
        const optionsToSelect = this.helpWithFeesRadio.getByLabel(yesOrNo);
        await optionsToSelect.check();
    }

    async assertErrorMessageForHelpWithFees() {
        const errorMessage = 'Has the applicant applied for help with fees online? is required';
        await this.assertErrorMessage([errorMessage]);
    }
}
