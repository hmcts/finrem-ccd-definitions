import { type Page, expect } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { ExpressHelper } from '../../helpers/ExpressHelper';

export class ExpressCasePage extends BaseJourneyPage {

    private readonly expressExitPageContent: string = "Your application will no longer be entered in the Express Financial Remedy Pilot.";
    private readonly expressEnterPageContent: string = "Your application has been entered into the Express Financial Remedy Pilot.";

    public constructor(page: Page) {
        super(page);
    }

    async checkExitContent() {
        await expect(this.page.locator(`text=${this.expressExitPageContent}`)).toBeVisible();
    }

    async checkEnterContent() {
        await expect(this.page.locator(`text=${this.expressEnterPageContent}`)).toBeVisible();
    }

    async checkLinkResolves() {
        const helper = new ExpressHelper(this.page);
        await helper.checkLinkResolves();
    }

}
