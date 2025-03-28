import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class AmendApplicationDetailsPage extends BaseJourneyPage {
    private estimatedAssetsLabel: Locator;

    public constructor(page: Page) {
        super(page);
        this.estimatedAssetsLabel = this.page.getByText('Please state the current estimated net assets in this case:');
    }

    async verifyEstimatedAssetsLabelIsVisible() {
        await expect(this.estimatedAssetsLabel).toBeVisible();
    }
}
