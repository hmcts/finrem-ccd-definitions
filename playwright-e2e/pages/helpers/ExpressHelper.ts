import { type Page, expect, Locator } from '@playwright/test';

export class ExpressHelper {

    private readonly guidanceLink: Locator;
    private readonly page: Page;
    private readonly guidanceLinkUrl: string = "https://www.gov.uk/guidance/what-to-expect-if-you-are-in-the-express-financial-remedy-pilot";
    private readonly guidancePageContent: string = "What to expect if you are in the express financial remedy pilot";

    public constructor(page: Page) {
        this.page = page;
        this.guidanceLink = page.locator(`a[href="${this.guidanceLinkUrl}"]`);
    }

    /**
    * Checks the correct GOV.UK Express Case guidance URL is visible on the page.
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
