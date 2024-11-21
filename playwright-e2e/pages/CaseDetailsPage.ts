import { type Page, expect, Locator } from '@playwright/test';
import config from '../config/config';
import { CaseEvent } from '../config/case_events';

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

    async selectNextStep(event: CaseEvent) {
        await this.page.waitForLoadState();
        await this.goButton.isVisible();
        await this.selectNextStepDropDown.selectOption(event.listItem);
        await this.goButton.click({clickCount:2,delay:500}); 
        await this.page.waitForURL(`**/${event.ccdCallback}/**`);
        // await expect(async () => {
           
        // }).toPass({timeout: config.timeout});
    }

    async checkHasBeenUpdated() {
        await expect(this.successfulUpdateBanner).toBeVisible();
    }

}
