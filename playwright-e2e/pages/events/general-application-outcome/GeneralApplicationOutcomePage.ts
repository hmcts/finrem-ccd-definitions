import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class GeneralApplicationOutcomePage extends BaseJourneyPage {

    private readonly updateGeneralApplicationOutcomeRadio: Locator;
    private readonly checkEventSummaryLabel: Locator;
    private readonly eventSummaryDetails: Locator;

    public constructor(page: Page) {
        super(page);
        this.updateGeneralApplicationOutcomeRadio = page.locator('#generalApplicationOutcome-Approved');
        this.checkEventSummaryLabel = page.getByText('Event summary (optional)');
        this.eventSummaryDetails = page.locator('#field-trigger-summary');
    }

    async selectGeneralApplicationOutcome() {
        await this.updateGeneralApplicationOutcomeRadio.check();
    }

    async enterEventSummary(text: string) {
        await expect(this.checkEventSummaryLabel).toBeVisible();
        await this.eventSummaryDetails.fill(text);
    }
}
