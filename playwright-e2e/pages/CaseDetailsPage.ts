import { type Page, expect, Locator } from '@playwright/test';

export class CaseDetailsPage {
    readonly page: Page;

    readonly successfulCreationBanner: Locator;

    public constructor(page: Page){
        this.page = page;
        this.successfulCreationBanner = page.getByText('has been created');
    }

    async checkHasBeenCreated() {
        await expect(this.successfulCreationBanner).toBeVisible();
    }
}