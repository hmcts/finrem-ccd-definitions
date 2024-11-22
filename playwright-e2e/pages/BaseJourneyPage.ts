import { type Page, expect, Locator } from '@playwright/test';

export abstract class BaseJourneyPage {
    protected readonly page: Page;

    private readonly continueButton: Locator;
    private readonly previousButton: Locator;
    private readonly submitButton: Locator
    private readonly spinner: Locator;

    public constructor(page: Page) {
        this.page = page;

        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });
        this.spinner = this.page.locator("xuilib-loading-spinner");
    }

    async navigateSubmit() {
        await this.page.waitForLoadState();
        await expect(this.submitButton).toBeVisible();
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
        await this.waitForSpinner();
    }

    async navigateContinue() {
        await this.page.waitForLoadState();
        await expect(this.continueButton).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
        await this.continueButton.click();
        await this.waitForSpinner();
    }

    async navigatePrevious() {
        await this.page.waitForLoadState();
        await expect(this.previousButton).toBeVisible();
        await expect(this.previousButton).toBeEnabled();
        await this.continueButton.click();
        await this.waitForSpinner();
    }

    private async waitForSpinner() {
      await expect
        .poll(
          async () => {
            const spinnerCount = await this.spinner.count();
            return spinnerCount;
          })
        .toBe(0);
    }
}
