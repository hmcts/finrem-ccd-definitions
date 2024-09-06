import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class RespondentRepresentedPage extends BaseJourneyPage{

    private readonly respondentRepresentedRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.respondentRepresentedRadio = page.locator('#respondentRepresented_radio')
    }

    async selectRespondentRepresented(represented: boolean) {
        const radioOption = represented ? 'Yes' : 'No'; 
        const optionToSelect = this.respondentRepresentedRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
