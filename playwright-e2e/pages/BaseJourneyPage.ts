import { type Page, expect, Locator } from '@playwright/test';

export abstract class BaseJourneyPage {
    protected readonly page: Page;

    private readonly continueButton: Locator;
    private readonly previousButton: Locator;
    private readonly submitButton: Locator

    public constructor(page: Page) {
        this.page = page;

        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });
    }

    async navigateSubmit() {
        await this.page.waitForLoadState();
        await expect(this.submitButton).toBeVisible();
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }

    async navigateContinue() {
        await this.page.waitForLoadState();
        await expect(this.continueButton).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
        await this.continueButton.click();
    }

    async navigatePrevious() {
        await this.page.waitForLoadState();
        await expect(this.previousButton).toBeVisible();
        await expect(this.previousButton).toBeEnabled();
        await this.continueButton.click();
    }
}
