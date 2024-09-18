import { type Page, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../BaseJourneyPage';

export class MiamQuestionPage extends BaseJourneyPage {

    private readonly applicantAttendMiamRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.applicantAttendMiamRadio = page.locator('#applicantAttendedMIAM_radio');
    }

    async selectHasAttendedMiam(hasAttenedMaim: Boolean){
        const radioOption = hasAttenedMaim ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantAttendMiamRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}
