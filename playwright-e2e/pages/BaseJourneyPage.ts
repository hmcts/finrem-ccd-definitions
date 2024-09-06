import { type Page, expect, Locator } from '@playwright/test';
import { CommonActionsHelper } from './helpers/CommonActionsHelper';

export abstract class BaseJourneyPage {
    readonly page: Page;

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
        await expect(this.submitButton).toBeVisible();
        await this.submitButton.click();
    }

    async navigateContinue() {
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

    async navigatePrevious() {
        await expect(this.previousButton).toBeVisible();
        await this.continueButton.click();
    }
}
