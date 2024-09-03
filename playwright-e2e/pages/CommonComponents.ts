import { type Page, expect, Locator } from '@playwright/test';

export class CommonComponents {

    readonly page: Page;

    readonly continueButton: Locator;
    readonly previousButton: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });
    }

    async navigateContinue() {
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

    async navigatePrevious() {
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

}