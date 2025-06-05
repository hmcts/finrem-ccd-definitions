import { Locator, Page } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class HelpWithFeesPage extends BaseJourneyPage {
    
    private helpWithFeesRadio: Locator;

    constructor(page: Page) {
        super(page);

        this.helpWithFeesRadio = page.locator('#helpWithFeesQuestion_radio');
    }

    async selectHelpWithFees(hasHelpWithFees: boolean) {
        const radioOption = hasHelpWithFees ? 'Yes' : 'No';
        const optionToSelect = this.helpWithFeesRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
