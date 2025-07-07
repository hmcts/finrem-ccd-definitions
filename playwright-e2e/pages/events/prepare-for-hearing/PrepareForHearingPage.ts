import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';

export class PrepareForHearingPage extends BaseJourneyPage {

    private readonly updateIncludesRepresentativeChangeRadio: Locator;
    private readonly contestedSolicitorNameDetails: Locator;

    public constructor(page: Page) {
        super(page);
        this.updateIncludesRepresentativeChangeRadio = page.locator('#updateIncludesRepresentativeChange_radio');
        this.contestedSolicitorNameDetails = page.locator('#applicantSolicitorName');
    }

    async selectUpdateIncludesRepresentativeChange(isUpdateIncludesRepresentativeChange: Boolean){
        const radioOption = isUpdateIncludesRepresentativeChange ? 'Yes' : 'No'; 
        const optionToSelect = this.updateIncludesRepresentativeChangeRadio.getByLabel(radioOption);
        await optionToSelect.check();
    }
}