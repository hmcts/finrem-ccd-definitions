import {BaseJourneyPage} from "../BaseJourneyPage.ts";
import {expect, Locator, Page} from "@playwright/test";

export class EventSummaryPage extends BaseJourneyPage {
    private readonly eventSummary: Locator;
    private readonly eventDescription: Locator;

    public constructor(page: Page) {
        super(page);
        this.eventSummary = page.locator('#field-trigger-summary');
        this.eventDescription = page.locator('#field-trigger-description');
    }

    async enterEventSummaryAndDescription(summary: string, description: string) {
        await expect(this.eventSummary).toBeVisible();
        await expect(this.eventDescription).toBeVisible();

        await this.eventSummary.fill(summary);
        await this.eventDescription.fill(description);
    }
}
