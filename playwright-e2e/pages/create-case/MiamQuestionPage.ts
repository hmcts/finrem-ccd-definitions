import { type Page, Locator } from '@playwright/test';

export class MiamQuestionPage {
    readonly page: Page;

    readonly applicantAttendMiamRadio: Locator;

    public constructor(page: Page) {
        this.page = page

        this.applicantAttendMiamRadio = page.locator('#applicantAttendedMIAM_radio');
    }

    async selectHasAttenedMiam(hasAttenedMaim: Boolean){
        const radioOption = hasAttenedMaim ? 'Yes' : 'No'; 
        const optionToSelect = this.applicantAttendMiamRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}