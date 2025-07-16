import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class GeneralApplicationOutcomePage extends BaseJourneyPage {

    private readonly updateGeneralApplicationOutcomeRadio: Locator;

    public constructor(page: Page) {
        super(page);
        this.updateGeneralApplicationOutcomeRadio = page.locator('#generalApplicationOutcome-Approved');
    }

    async selectGeneralApplicationOutcome() {
        await this.updateGeneralApplicationOutcomeRadio.check();
    }
}
