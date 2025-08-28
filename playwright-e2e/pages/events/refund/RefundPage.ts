import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class RefundPage extends BaseJourneyPage {
    private refundHeader: Locator;

    public constructor(page: Page) {
        super(page);
        this.refundHeader = page.getByRole('heading', { name: 'Refund' });
    }

    async verifyRefundPageDisplayed() {
        await expect(this.refundHeader).toBeVisible();
    }
}

