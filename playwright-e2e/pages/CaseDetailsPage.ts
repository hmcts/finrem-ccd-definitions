import { type Page, expect, Locator } from '@playwright/test';

export class CaseDetailsPage {

    private readonly page: Page;

    readonly successfulCreationBanner: Locator;
    readonly successfulUpdateBanner: Locator;
    readonly selectNextStepDropDown: Locator
    readonly goButton: Locator;
    readonly closeAndReturnButton: Locator; 

    public constructor(page: Page){
        this.page = page;
        this.successfulCreationBanner = page.getByText('has been created');
        this.successfulUpdateBanner = page.getByText('has been updated');
        this.selectNextStepDropDown = page.getByLabel('Next step');
        this.goButton = page.getByRole('button', { name: 'Go' })
        this.closeAndReturnButton = page.getByRole('button', { name: 'Close and Return to case' })
    }

    async checkHasBeenCreated() {
        await expect(this.successfulCreationBanner).toBeVisible();
    }

    async selectNextStep(step: string) {
        await this.selectNextStepDropDown.selectOption(step)
        await this.goButton.click();
    }

    async checkHasBeenUpdated() {
        await expect(this.successfulUpdateBanner).toBeVisible();
    }

}
