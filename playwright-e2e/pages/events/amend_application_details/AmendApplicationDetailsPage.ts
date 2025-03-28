import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from "../../BaseJourneyPage";

export class AmendApplicationDetailsPage extends BaseJourneyPage {
    private estimatedAssetsLabel: Locator;
    private estimatedAssetsUnder250k: Locator;
    private netValueOfHome: Locator;

    public constructor(page: Page) {
        super(page);
        this.estimatedAssetsLabel = this.page.getByText('Please state the current estimated net assets in this case:');
        this.estimatedAssetsUnder250k = this.page.getByLabel('Under £250,000 (this should be total of combined net assets, but excluding pensions)');
        this.netValueOfHome = this.page.locator('input[id="netValueOfHome"]');
    }

    async verifyEstimatedAssetsLabelIsVisible() {
        await expect(this.estimatedAssetsLabel).toBeVisible();
    }

    async selectUnder250k() {
        expect(this.estimatedAssetsUnder250k).toBeVisible();
        await this.estimatedAssetsUnder250k.check();
    }

    async enterEstimatedAssets(value: string) {
        expect(this.netValueOfHome).toBeVisible();
        await this.netValueOfHome.fill(value);
    }

    async verifyDynamicEnrollmentMessageIsVisible() {
        const dynamicEnrollmentMessage = this.page.getByText('Your application has been entered into the Express Financial Remedy Pilot.');
        await expect(dynamicEnrollmentMessage).toBeVisible();
    }
}
