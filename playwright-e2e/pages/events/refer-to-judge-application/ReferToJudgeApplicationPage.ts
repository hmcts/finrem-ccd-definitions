import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class ReferToJudgeApplicationPage extends BaseJourneyPage {

    private readonly checkEventSummaryLabel: Locator;
    private readonly eventSummaryDetails: Locator;

    public constructor(page: Page) {
        super(page);
        this.checkEventSummaryLabel = page.getByText('Event summary (optional)');
        this.eventSummaryDetails = page.locator('#field-trigger-summary');
    }

    async enterEventSummary(text: string) {
        await expect(this.checkEventSummaryLabel).toBeVisible();
        await this.eventSummaryDetails.fill(text);
    }
}
