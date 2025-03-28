import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { Context } from 'node:vm';

export class ExpressCasePage extends BaseJourneyPage {

    private readonly expressExitPageContent: string = "Your application will no longer be entered in the Express Financial Remedy Pilot.";

    public constructor(page: Page) {
        super(page);
    }

    async checkExitContent() {
        await expect(this.page.locator(`text=${this.expressExitPageContent}`)).toBeVisible();
    }
}
