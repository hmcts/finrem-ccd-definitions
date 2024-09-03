import { type Page, expect, Locator } from '@playwright/test';

export class RespondentRepresentedPage {
    readonly page: Page;

    readonly respondentRepresentedRadio: Locator;

    public constructor(page: Page) {
        this.page = page

        this.respondentRepresentedRadio = page.locator('#respondentRepresented_radio')
    }

    async selectRespondentRepresented(represented: boolean) {
        const radioOption = represented ? 'Yes' : 'No'; 
        const optionToSelect = this.respondentRepresentedRadio.getByLabel(radioOption);
        await optionToSelect.check();
      }
}