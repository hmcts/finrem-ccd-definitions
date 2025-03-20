import { type Page, expect, Locator } from '@playwright/test';
import { BaseJourneyPage } from '../../BaseJourneyPage';
import { Context } from 'node:vm';

export class ExpressCaseEnrolledPage extends BaseJourneyPage {

    private readonly guidanceLink: Locator;
    private readonly guidanceLinkUrl: string = "https://www.gov.uk/guidance/what-to-expect-if-you-are-in-the-express-financial-remedy-pilot";
    private readonly guidancePageContent: string = "Page not found";

    public constructor(page: Page) {
        super(page);
        this.guidanceLink = page.locator(`a[href="${this.guidanceLinkUrl}"]`);
    }

    /**
    * Click the link, which opens in a new tab.
    * Checks that the expected content is showing on the new tab.
    * Closes the tab when done.
    *
    * NOTE: Page not on GOV.UK yet, so looking for "Page not found".
    */
    async checkLinkResolves() {

        await expect(this.guidanceLink).toBeVisible();

        // Click the link and capture the new tab that opens
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.guidanceLink.click()
        ]);

        // Wait for the HTML on the new tab to completely load
        await newPage.waitForLoadState('domcontentloaded');

        await expect(newPage.locator(`text=${this.guidancePageContent}`)).toBeVisible();

        await newPage.close();
    }
}
